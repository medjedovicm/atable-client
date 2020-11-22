import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/single-services/user-service/user.service';
import { UserModel } from '../../../models/UserModel';
import {AtableUserModel, AtableTime} from '../../../models/AtableModel';
import {ActivatedRoute} from '@angular/router';
import * as moment from "moment";
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {
  currentUserId = localStorage.getItem("user_id");
  user_id = null;
  userData = new UserModel();
  // userProfileData = new UserModel();
  isEmpty: boolean = true;
  firstName: string = "";
  lastName: string = "";

  editModal: boolean = false;

  imageToSend: any = null;
  profileImagePreview: any = null;
  imagePreviewLoading: boolean = false;

  croppingActive: boolean = false;
  croppedImage: any = null;
  
  cropperLoading: boolean = false;
  imageChangedEvent: any;

  profileReady: boolean = false;
  backToTeamId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private readonly userService: UserService,
    private _snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.user_id = params.id;

      let queryParams = this.route.snapshot.queryParams;
      if (queryParams.return) {
        this.backToTeamId = queryParams.return;
      }

      this.fetchUserData();
    });
  };

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  submitProfileData() {
    if (this.imageToSend === null) {
      this.userService.confirmUserData(this.user_id, this.userData).subscribe((user) => {
        console.log(user);
        this.fetchUserData();
      });
    } else {
      this.userService.uploadPicture(this.user_id, this.imageToSend).subscribe(res => {
        console.log(res);

        this.userData.profile_image = res['filename'];

        this.userService.confirmUserData(this.user_id, this.userData).subscribe(res => {
          console.log(res);
          this.fetchUserData();
        });
      });
    }
  }

  fetchUserData() {
    this.userService.getUserData(this.user_id).subscribe(user => {
      this.userData = user;

      this.profileImagePreview = this.userData.profile_image ? this.userService.getProfileImageUrl(this.userData.profile_image) : null;
      
      this.userService.setCurrentUser();

      setTimeout(() => {this.profileReady = true}, 100);
    })
  }

  profileImageChange(event) {
    this.imagePreviewLoading = true;

    let imageFile = event.target.files[0];

    if (imageFile) {
      const file: File = imageFile;
      var pattern = /image-*/;

      if (!file.type.match(pattern)) {
        this.openSnackBar("Sorry, picture formats allowed only!", null);
        this.imagePreviewLoading = false;
        return;
      }

      this.croppingActive = true;
      this.cropperLoading = true;
      this.imageChangedEvent = event;

      // this.imageToSend = imageFile;
      // this.getImageBase64(imageFile);
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;

    let ImageURL = event.base64;
    let block = ImageURL.split(";");
    let contentType = block[0].split(":")[1];
    let extension = contentType.split('/')[1];
    // let realData = block[1].split(",")[1];

    this.urltoFile(ImageURL, "profilepic." + extension, contentType).then(image => {
      this.imageToSend = image;
    });
  }
  imageLoaded() {
    this.cropperLoading = false;
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  urltoFile(url, filename, mimeType){
    return (fetch(url)
        .then(function(res){return res.arrayBuffer();})
        .then(function(buf){return new File([buf], filename,{type:mimeType});})
    );
  }

  getImageBase64(imageFile: any) {
    let reader = new FileReader();

    reader.onload = () => {
      this.profileImagePreview = reader.result;
      this.imagePreviewLoading = false;
    }

    reader.readAsDataURL(imageFile);
  }

  editProfile() {
    this.editModal = true;
  }

  saveProfile() {
    this.submitProfileData();
    this.exitEdit();
  }

  cancelEdit() {
    this.exitEdit();
    this.fetchUserData();
  }

  exitEdit() {
    this.editModal = false;
    
    (document.getElementById('profileImageInput') as HTMLInputElement).value = "";

    setTimeout(() => {
      this.imageToSend = null;
      this.imagePreviewLoading = false;
      this.croppingActive = false;
      this.cropperLoading = false;
      this.croppedImage = null;
      this.imageChangedEvent = null;
    }, 200);
  }

  lastLogin() {
    return moment(this.userData.last_login).format('MMMM D, YYYY h:mm a');
  }
}
