import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/single-services/auth-service/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  email: string = "";
  password: string = "";

  loginError: string = "noerr";
  loginLoading: boolean = false;

  invite_string: string;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.navigateToAuth();
    } else {
      if (this.authService.isSessionExpired) {
        this.authService.isSessionExpired = false;
        this.loginError = "Dang it, session expired, log in again";
      }
    }

    this.invite_string = localStorage.getItem("invite_string");

    console.log(this.invite_string);

    if (!!this.invite_string) {
      this.loginError = "Before we proceed, please sign in or sign up";
    }

    document.title = "aTable | Sign In";
  }

  login() {
    if (this.email.length > 0 && this.password.length > 0) {
      if (this.isEmailValid(this.email)) {
        this.loginError = "noerr";
        this.loginLoading = true;

        this.authService.loginWithPassword(this.email, this.password).subscribe(res => {
          console.log(res);

          this.loginLoading = false;
          if (res['message']) {
            this.loginError = res['message']
          } else {
            let token = res['token'];
            localStorage.setItem("access_token", token);

            let tokenData = this.authService.decodeToken(token);
            // console.log(tokenData);
            localStorage.setItem("user_id", tokenData._id);

            if (!!this.invite_string) {
              this.navigateToTeamJoin();
            } else {
              this.navigateToAuth();
            }
          }
        }, err => {
          console.log(err.error.detail);
          this.loginError = err.error.detail;
          this.loginLoading = false;
        });
      } else {
        this.loginError = "Sorry, email address is not valid";
      }
    }
  }

  public isEmailValid(email: string) {
    if (!email.includes('@')) {
      return false;
    }

    let beforeAt = email.split('@')[0];
    let afterAt = email.split('@')[1];

    if (beforeAt === "") return false;
    if (!afterAt.includes('.')) return false;
    if (afterAt.split('.')[0] === "" || afterAt.split('.')[1] === "") return false;

    return true;
  }

  navigateToAuth() {
    this.router.navigateByUrl("auth");
  }

  navigateToTeamJoin() {
    this.router.navigateByUrl('invite/' + this.invite_string);
  }

  ngOnDestroy() {
    document.title = "aTable";
  }
}
