import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { app_config } from 'app-config';
import {environment} from '../../../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isSessionExpired: boolean = false;
  public isUserVerified = new BehaviorSubject(true);

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService
  ) {
    
  }

  public loginWithPassword(email: string, password: string) {
    return this.http.post(environment.api.url + "auth/login", {email: email, password: password});
  }

  public checkIsVerified() {
    let user_id = localStorage.getItem("user_id");

    if (user_id) {
      let verificationSub = this.http.get(environment.api.url + "auth/verification-status/" + user_id)
      .subscribe(res => {
  
        let isVerified = res['isActivated'];
        this.isUserVerified.next(isVerified);
        verificationSub.unsubscribe();
      });
    }
  }

  public logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    this.router.navigateByUrl("login");
  }

  public isLoggedIn() {
    let token = localStorage.getItem("access_token");

    if (!token) {
      return false;
    } else {
      if (this.jwtHelper.isTokenExpired(token)) {
        return false;
      } else {
        return true;
      }
    }
  }

  public registerUser(email: string, username: string, password: string, fullname: string) {
    return this.http.post(environment.api.url + "auth/register", {username: username, email: email, password: password, full_name: fullname});
  }

  public decodeToken(token) {
    return this.jwtHelper.decodeToken(token);
  }

  public isTokenExpired(token) {
    return this.jwtHelper.isTokenExpired(token);
  }
}
