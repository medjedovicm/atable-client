import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import { TeamModel } from 'src/app/models/TeamModel';
import { TeamService } from 'src/app/services/single-services/team-service/team.service';
import {Router} from '@angular/router';
import {MatInput} from '@angular/material/input';
import { UserService } from '../../../services/single-services/user-service/user.service';


@Component({
  selector: 'app-team-select',
  templateUrl: './team-select.component.html',
  styleUrls: ['./team-select.component.scss'],

})
export class TeamSelectComponent implements OnInit, AfterViewInit {
  @ViewChildren("teamNameInput") teamNameChildren: QueryList<any>;

  teamNameInput: ElementRef<MatInput>;

  teams: TeamModel[] = [];
  newTeam: TeamModel = new TeamModel();

  pageLoading: boolean = true;
  screen: string = "list";

  inviteUrl: string = "";
  blingEffect: boolean = false;
  highlightTeamId: any = null;

  currentUserProfile = this.userService.currentUserProfile;

  constructor(
    private teamService: TeamService,
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.blingEffect = true;
    }, 1000);

    setTimeout(() => {
      this.blingEffect = false;
    }, 3000);

    this.fetchTeams();
  }

  ngAfterViewInit(): void {
    this.teamNameChildren.changes.subscribe((r) => {
      this.teamNameInput = r.first;

      if (this.screen === "create") {
        this.focusTeamNameInput();
        this.cdr.detectChanges();
      }
    });
  }

  public checkForNewTeam() {
    let highlight_team_id = localStorage.getItem("highlight_new");

    if (highlight_team_id) {
      this.highlightTeamId = highlight_team_id;
      localStorage.removeItem("highlight_new");

      this.highlightNewTeam()
    }
  }

  public highlightNewTeam() {
    setTimeout(() => {
      let teamIndex = this.teams.findIndex(x => x._id === this.highlightTeamId);

      if (teamIndex) {
        this.teams[teamIndex]['highlight_new'] = true;
      }

      this.highlightTeamId = null;

      setTimeout(() => {
        this.teams[teamIndex]['highlight_new'] = false;
      }, 2000);
    }, 500);
  }

  public createTeamServer() {
    if (this.newTeam.team_name.length > 0) {
      this.teamService.createTeam(this.newTeam).subscribe(res => {
        console.log(res);

        this.highlightTeamId = res['team']['_id'];
        this.fetchTeams();
        this.newTeam = new TeamModel();
        this.screen = "list";

      }, err => {
        console.log(err);
      });
    }
  }

  public createTeam() {
    this.screen = "create";
  }

  public cancelCreate() {
    this.screen = "list";
  }

  public fetchTeams() {
    this.teamService.getUserTeams().subscribe(teams => {
      this.teams = teams;

      this.pageLoading = false;

      if (this.highlightTeamId) {
        this.highlightNewTeam();
      } else {
        this.checkForNewTeam();
      }
    });
  }

  public openTeamRoom(team) {
    this.router.navigateByUrl("auth/team-room/" + team._id);
  }

  public focusTeamNameInput() {
    this.teamNameInput.nativeElement.focus();
  }
}
