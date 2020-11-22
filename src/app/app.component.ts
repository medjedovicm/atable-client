import { Component } from '@angular/core';
import { AuthService } from './services/single-services/auth-service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  responseResult: any = "";
  errorResult: any = "";
  public isUserVerified = this.authService.isUserVerified;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    
  }

  isPageAuth() {
    return this.router.url.includes("auth");
  }
}
