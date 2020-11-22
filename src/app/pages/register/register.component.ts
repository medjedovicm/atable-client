import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/single-services/auth-service/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  email: string = "";
  username: string = "";
  password: string = "";
  fullName: string = "";

  registerError: string = "noerr";
  registerLoading: boolean = false;

  errorsList: string[] = [];

  invite_string: string;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.invite_string = localStorage.getItem("invite_string");

    document.title = "aTable | Sign Up";
  }

  register() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("tokenData");

    if (this.email.length > 0 && this.password.length > 0 && this.username.length > 0 && this.fullName.length > 0) {
      this.registerError = "noerr";
      this.errorsList = [];
      this.registerLoading = true;

      this.authService.registerUser(this.email, this.username, this.password, this.fullName).subscribe(res => {
        console.log(res);
        if (res['message']) {
          this.errorsList.push(res['message']);
        } else {
          this.login();
        }

      }, err => {
        console.log(err.error);

        let errors = err.error;

        if (errors['username']) {
          this.errorsList.push(errors['username']);
        }

        if (errors['email']) {
          this.errorsList.push(errors['email']);
        }

        this.registerError = err.error.detail;
        this.registerLoading = false;
      });
    }
  }

  navigateToAuth() {
    this.router.navigateByUrl("auth");
  }

  navigateToTeamJoin() {
    this.router.navigateByUrl('invite/' + this.invite_string);
  }

  login() {
    this.authService.loginWithPassword(this.email, this.password).subscribe(res => {
      console.log(res);

      let token = res['token'];
      localStorage.setItem("access_token", token);

      let tokenData = this.authService.decodeToken(token);
      localStorage.setItem("tokenData", tokenData);
      localStorage.setItem("user_id", tokenData._id);
      this.registerLoading = false;

      if (!!this.invite_string) {
        this.navigateToTeamJoin();
      } else {
        this.navigateToAuth();
      }

    }, err => {
      console.log(err);
    });
  }

  ngOnDestroy() {
    document.title = "aTable";
  }
}
