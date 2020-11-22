import { NgModule } from '@angular/core';
import {Routes, RouterModule, Router, ActivatedRoute} from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthStartComponent } from './pages/auth-start/auth-start.component';
import { HomeComponent } from './pages/auth-start/home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { AtableComponent } from './components/atable/atable.component';
import { TeamUpdateComponent } from './pages/auth-start/team-update/team-update.component';
import { TeamSelectComponent } from './pages/auth-start/team-select/team-select.component';
import {TeamRoomComponent} from './pages/auth-start/team-room/team-room.component';
import {InviteComponent} from './pages/invite/invite.component';
import { ProfilePageComponent } from './pages/auth-start/profile-page/profile-page.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { VerifyComponent } from './pages/verify/verify.component';
import { AtbTaskComponent } from './components/atb-task/atb-task.component';

const routes: Routes = [
  {path: "", redirectTo: "/login", pathMatch: "full"},
  // {path: "auth", redirectTo: "/auth/home", pathMatch: "full"},

  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},

  {
    path: "auth",
    component: AuthStartComponent,
    canActivate: [AuthGuard],
    children: [
      {path: "team-room/:id", redirectTo: "team-room/:id/atable", pathMatch: "full"},
      {path: "home", component: HomeComponent},
      {path: "atable", component: AtableComponent},
      {path: "team-update", component: TeamUpdateComponent},
      {path: "team-select", component: TeamSelectComponent},
      {
        path: "team-room/:id",
        component: TeamRoomComponent,
        children: [
          {path: "atable", component: AtableComponent},
          {path: "tasks/:task_id", component: AtbTaskComponent}
        ]
      },
      // {path: "team-room/:id/:page", component: TeamRoomComponent},
      // {path: "team-room/:id/:page/:task_id", component: TeamRoomComponent},
      {path: "profile/:id", component: ProfilePageComponent}
    ]
  },
  {path: "invite/:team_id", component: InviteComponent},
  {path: "account/verify/:user_id", component: VerifyComponent},
  { path: '**', component: PageNotFoundComponent }
];
//api/users/activate
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
