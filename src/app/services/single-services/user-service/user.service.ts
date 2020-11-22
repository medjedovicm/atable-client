import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserModel } from '../../../models/UserModel';
import {environment} from '../../../../environments/environment';
import { AtableUserModel } from '../../../models/AtableModel';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public currentUserProfile = new BehaviorSubject<UserModel>(new UserModel());

  constructor(
    private http: HttpClient
  ) { } 
    
  public setCurrentUser() {
    let user_id = localStorage.getItem('user_id');

    this.getUserData(user_id).subscribe((user: UserModel) => {
      user.profile_image = this.getProfileImageUrl(user.profile_image);
      this.currentUserProfile.next(user);
    });
  }
  public getUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(environment.api.url + "users");
  }

  public confirmUserData(user_id: string, user: UserModel): Observable<UserModel[]> {
    return this.http.put<UserModel[]>(environment.api.url + "users/" + user_id, user);
  }

  public getUserData(id): Observable<UserModel> {
    return this.http.get<UserModel>(environment.api.url + 'users/' + id)
  }

  public uploadPicture(user_id: string, picture: any) {
    let formData: FormData = new FormData();

    formData.append("files[]", picture, picture.name);

    return this.http.post(environment.api.url + "users/profile/" + user_id + "/picture", formData);
  }

  public getProfileImageUrl(filename: string) {
    if (!filename) {
      return 'assets/dragislava.svg';
    }
    return environment.api.url + "users/images/profile/" + filename;
  }
}
