import { Component, OnInit } from '@angular/core';
import { TeamService } from 'src/app/services/single-services/team-service/team.service';
import {ActivatedRoute, Router} from '@angular/router';
import { AuthService } from '../../services/single-services/auth-service/auth.service';
import { UserService } from '../../services/single-services/user-service/user.service';

@Component({
  selector: 'app-auth-start',
  templateUrl: './auth-start.component.html',
  styleUrls: ['./auth-start.component.scss']
})
export class AuthStartComponent implements OnInit {
  loading: boolean = true;

  gotoTeamId: string;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private teamService: TeamService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.authService.checkIsVerified();
    this.userService.setCurrentUser();

    this.gotoTeamId = localStorage.getItem("goto_team");

    if (!!this.gotoTeamId) {
      this.goToTeamOverride();
    } else {
      this.getUserTeams();
    }
  }

  ngOnInit() {

  }

  public goToTeamOverride() {
    localStorage.removeItem("goto_team");
    this.navigateToOneTeam(this.gotoTeamId);
  }

  public getUserTeams() {
    this.teamService.getUserTeams().subscribe(teams => {
      console.log(teams);

      if (teams.length > 0) {
        // if (teams.length === 1) {
        //   let teamId = teams[0]._id;
        //   this.navigateToOneTeam(teamId);
        // } else {
        //   this.haveTeams();
        // }

        if (this.router.url.includes("team-room")) {
          let urlSplited = this.router.url.split("/");
          let teamId = urlSplited[urlSplited.length - 1];

          if (teams.find(team => team._id === teamId)) {
            this.navigateToOneTeam(teamId);
          }
        } else {
          this.haveTeams();
        }
      } else {
        this.noTeams();
      }
    });
  }

  public noTeams() {
    this.stopLoading();
    this.router.navigateByUrl("/auth/team-update");
  }

  public navigateToOneTeam(teamId) {
    this.stopLoading();
    this.router.navigateByUrl("/auth/team-room/" + teamId);
  }

  public haveTeams() {
    this.stopLoading();
    this.router.navigateByUrl("/auth/team-select");
  }

  public stopLoading() {
    this.loading = false;
  }

}
