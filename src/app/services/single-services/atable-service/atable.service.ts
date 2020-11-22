import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AtableUserModel, AtableTime} from 'src/app/models/AtableModel';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AtableService {
  // aTableUsers: AtableTime[] = [
  //   {id: 4, username: "Mihajlo", start_time: "", end_time: "",},
  //   {id: 2, username: "Dragoslav", start_time: "10:30", end_time: "17:45"},
  //   {id: 3, username: "Dragoslav", start_time: "13:00", end_time: "15:00"},
  //   {id: 6, username: "Dragoslav", start_time: "14:00", end_time: "17:00"},
  //   {id: 7, username: "Dragoslav", start_time: "12:00", end_time: "16:00"},
  //   {id: 1, username: "Dragoslav", start_time: "06:00", end_time: "15:00"},
  //   {id: 5, username: "Dragoslav", start_time: "", end_time: ""},
  // ]

  constructor(
    private http: HttpClient
  ) {

  }

  // public getUsers(): Observable<AtableTime[]> {
  //   return of(this.aTableUsers);
  // }

  public getTeamUsers(teamId): Observable<AtableUserModel[]> {
    return this.http.get<AtableUserModel[]>(environment.api.url + "teams/team/users/" + teamId);
  }

  public getTeamUsersByMonth(teamId, month): Observable<AtableUserModel[]> {
    return this.http.get<AtableUserModel[]>(environment.api.url + "teams/team/users/" + teamId +"/" + month);
  }

  public createAtableTime(team_id, atableEntry) {
    return this.http.post(environment.api.url + "atable/atabletime/" + team_id, atableEntry);
  }

  public updateAtableTime(team_id, atable_id, atableEntry) {
    return this.http.put(environment.api.url + "atable/atabletime/" + atable_id, atableEntry);
  }

  public removeAtableTime(time_id) {
    return this.http.delete(environment.api.url + "atable/atabletime/" + time_id);
  }

  public postThreadComment(atable_id, thread_comment) {
    return this.http.post(environment.api.url + 'atable/atabletime/thread/' + atable_id, thread_comment)
  }

  public getThreadComments(atable_id) {
    return this.http.get(environment.api.url + 'atable/atabletime/thread/' + atable_id)
  }
}
