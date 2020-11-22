import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

// Bootstrap imports
import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

// Material imports
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSelectModule } from '@angular/material/select'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatSnackBar } from '@angular/material/snack-bar'

import { SatPopoverModule } from '@ncstate/sat-popover';

import { AtbButtonComponent } from './components/atb-button/atb-button.component';
import { AuthStartComponent } from './pages/auth-start/auth-start.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtModule, JWT_OPTIONS } from "@auth0/angular-jwt";
import { HomeComponent } from './pages/auth-start/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { AtableComponent } from './components/atable/atable.component';
import { TeamUpdateComponent } from './pages/auth-start/team-update/team-update.component';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';
import { TeamSelectComponent } from './pages/auth-start/team-select/team-select.component';
import { AtbNavigationComponent } from './components/atb-navigation/atb-navigation.component';
import { TeamRoomComponent } from './pages/auth-start/team-room/team-room.component';
import {AtbChatComponent} from './components/atb-chat/atb-chat.component';
import { InviteComponent } from './pages/invite/invite.component';
import {HttpConfigInterceptor} from './interceptor/httpconfig.interceptor';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { AtbModalComponent } from './components/atb-modal/atb-modal.component';
import { ProfilePageComponent } from './pages/auth-start/profile-page/profile-page.component';
import { app_config as config } from '../../app-config';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { VerifyComponent } from './pages/verify/verify.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgVarDirective } from './directives/ng-var.directive';
import { AtbTaskComponent } from './components/atb-task/atb-task.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { RippleGlobalOptions, MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { ImageUrlPipe } from './pipes/image-url.pipe';
import { ChatTimeElapsedPipe } from './pipes/chat-time-elapsed.pipe';
import { AtbContactSupportComponent } from './components/atb-contact-support/atb-contact-support.component';
import { AtbThreadModalComponent } from './components/atb-thread-modal/atb-thread-modal.component';

const globalRippleConfig: RippleGlobalOptions = {
  disabled: true,
  animation: {
    enterDuration: 300,
    exitDuration: 0
  }
};

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      return localStorage.getItem("access_token");
    },
    whitelistedDomains: [
      config.localUrl,
      config.prodDomain
    ]
  }
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    AtbButtonComponent,
    AuthStartComponent,
    HomeComponent,
    HeaderComponent,
    AtableComponent,
    TeamUpdateComponent,
    SplashScreenComponent,
    TeamSelectComponent,
    AtbNavigationComponent,
    AtbNavigationComponent,
    TeamRoomComponent,
    AtbChatComponent,
    InviteComponent,
    AtbModalComponent,
    ProfilePageComponent,
    PageNotFoundComponent,
    VerifyComponent,
    NgVarDirective,
    AtbTaskComponent,
    DateFormatPipe,
    ImageUrlPipe,
    ChatTimeElapsedPipe,
    AtbContactSupportComponent,
    AtbThreadModalComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ImageCropperModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [],
      },
    }),
    AlertModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTooltipModule,
    DragDropModule,
    SatPopoverModule,
    EditorModule
  ],
  providers: [
    MatSnackBar,
    {provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: globalRippleConfig},
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
