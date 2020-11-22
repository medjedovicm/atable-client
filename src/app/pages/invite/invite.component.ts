import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/single-services/auth-service/auth.service';
import {TeamService} from '../../services/single-services/team-service/team.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit {
  invite_string: string = "";
  loading: boolean = true;

  showErrorScreen: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private teamService: TeamService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.invite_string = params.team_id;

      if (this.invite_string) {
        this.checkToken();
      } else {
        this.router.navigateByUrl("/");
      }
    });
  }

  checkToken() {
    let token = localStorage.getItem("access_token");

    if (!!token) {
      if (this.authService.isTokenExpired(token)) {
        this.tokenExpired();
      } else {
        this.tokenValid();
      }
    } else {
      this.noToken();
    }

    console.log(this.authService.decodeToken(token));
    console.log(this.authService.isTokenExpired(token));
  }

  noToken() {
    console.log("token no token");

    localStorage.setItem("invite_string", this.invite_string);

    this.router.navigateByUrl("login");
  }

  tokenExpired() {
    console.log("token expired");

    localStorage.setItem("invite_string", this.invite_string);

    this.router.navigateByUrl("login");
    //after login check if there is invite string in localstorage
    //if yes then join it to team
    //open team room
  }

  tokenValid() {
    console.log("token valid");

    this.teamService.joinTeam(this.invite_string).subscribe(res => {
      console.log(res);
      let teamId = res['message']['_id'];

      if (res['error']) {
        this.removeInviteString();

        this.navigateToTeam(teamId);
      } else {
        this.removeInviteString();
        localStorage.setItem("highlight_new", teamId);
        // this.navigateToTeam(teamId);
        this.backToSafe();
      }
    }, err => {
      console.log(err.error);

      this.loading = false;
      //http://localhost:4200/gXRIRGD   invalid
      this.removeInviteString();
    });
  }

  navigateToTeam(teamId) {
    localStorage.setItem("goto_team", teamId);
    this.router.navigateByUrl("/auth/team-room/" + teamId);
  }

  backToSafe() {
    this.router.navigateByUrl("auth");
  }

  removeInviteString() {
    localStorage.removeItem("invite_string");
  }

}
