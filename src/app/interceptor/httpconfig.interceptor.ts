import { Injectable } from '@angular/core';

import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {AuthService} from '../services/single-services/auth-service/auth.service';
import {Router} from '@angular/router';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (this.router.url.includes("auth")) {
          if (!this.authService.isLoggedIn()) {
            this.authService.isSessionExpired = true;
            this.router.navigateByUrl("/login");
          }
        }


        return event;
      }));
  }
}
