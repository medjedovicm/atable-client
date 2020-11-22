import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TeamModel } from 'src/app/models/TeamModel';
import { TeamService } from 'src/app/services/single-services/team-service/team.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-team-update',
  templateUrl: './team-update.component.html',
  styleUrls: ['./team-update.component.scss']
})
export class TeamUpdateComponent implements OnInit, AfterViewInit {
  pageLoading: boolean = true;

  newTeam: TeamModel = new TeamModel();
  joinTeamString: string = "";

  invalidInvitationUrl: string = "noerr";

  constructor(
    private teamService: TeamService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.pageLoading = false;
    }, 500);
  }

  public createTeam() {
    if (this.newTeam.team_name.length > 0) {
      this.teamService.createTeam(this.newTeam).subscribe(res => {
        console.log(res);

        if (res) {
          if (res['message'] === "Team created successfully") {
            localStorage.setItem("highlight_new", res['team']['_id']);
            this.router.navigateByUrl("/auth/team-select");
          }
        }
      }, err => {
        console.log(err);
      });
    }
  }

  public joinTeam() {
    if (this.joinTeamString.length > 0) {
      if (this.joinTeamString.includes("http://")) {
        this.invalidInvitationUrl = "noerr";

        let urlSplited = this.joinTeamString.split('/');

        let inviteString = urlSplited[urlSplited.length - 1];

        this.teamService.joinTeam(inviteString).subscribe(res => {
          console.log(res);

          if (res['error']) {
            this.invalidInvitationUrl = "Whoah, it's impossible to enter the same room twice, don't you think?";
          } else {
            localStorage.setItem("highlight_new", res['message']['_id']);
            window.location.reload();
          }
        }, err => {
          console.log(err);

          this.invalidInvitationUrl = "Huh, it seems like dead-end!"
        });
      } else {
        this.invalidInvitationUrl = "Hold on a second, this is not a valid URL!";
      }
    }
  }
}
