import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { TeamModel } from 'src/app/models/TeamModel';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import { UserModel } from '../../../models/UserModel';
import { UserService } from '../user-service/user.service'
import { EventService } from '../../event-service/event.service';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  public teamUserProfiles = new BehaviorSubject<UserModel[]>([]);

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private eventService: EventService
  ) { }

  public setTeamUsers(team_id) {
    this.getTeamUsersProfiles(team_id).subscribe((users: UserModel[]) => {
      for (let user of users) {
        user.profile_image = this.userService.getProfileImageUrl(user.profile_image);
      }
      
      this.teamUserProfiles.next(users);
    })
  }

  public getUserTeams(): Observable<TeamModel[]> {
    return this.http.get<TeamModel[]>(environment.api.url + "teams/list");
  }

  public getTeamUsersProfiles(team_id: string): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(environment.api.url + "teams/profiles/" + team_id)
  }

  public createTeam(team: TeamModel) {
    return this.http.post(environment.api.url + "teams/createteam", team);
  }

  public getInviteUrl(teamId) {
    return this.http.get(environment.api.url + "teams/createurl/" + teamId);
  }

  public joinTeam(inviteString) {
    return this.http.get(environment.api.url + "teams/jointeam/" + inviteString);
  }

  public getTeamName(teamId) {
    return this.http.get<any>(environment.api.url + "teams/team/" + teamId);
  }

  public generateInviteUrl(teamId: string) {
    this.getInviteUrl(teamId).subscribe(res => {
      let inviteUrl = `${location.origin}/invite/${res['inviteUrl']}`;

      this.eventService.copyToClipboard(inviteUrl);
    });
  }
}
