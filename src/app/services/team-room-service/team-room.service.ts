import { Injectable } from '@angular/core';
import { TeamService } from '../single-services/team-service/team.service';
import { TaskService } from '../single-services/task-service/task.service';
import { TeamModel } from '../../models/TeamModel';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AtableService } from '../single-services/atable-service/atable.service';
import { TaskModel } from '../../models/TaskModel';
import { AtableUserModel } from '../../models/AtableModel';
import * as moment from 'moment';
import { SocketService } from '../socket-service/socket.service';

@Injectable({
  providedIn: 'root'
})
export class TeamRoomService {
  public team_id: string = null;
  public currentDate = moment();
  public currentMonth: number = moment().month() + 1;

  public currentTeam = new BehaviorSubject(null);
  public teamUsersSelectedDate = new BehaviorSubject([]);
  private teamUsersByMonth: AtableUserModel[] = [];
  public tasks = new BehaviorSubject([]);

  private roomUpdatesSubscribe: Subscription;

  constructor(
    private teamService: TeamService,
    private taskService: TaskService,
    private atableService: AtableService,
    private socketService: SocketService
  ) { }
  
  openTeamRoom(team_id: string) {
    this.team_id = team_id;

    this.roomUpdatesSubscribe = this.socketService.newTeamUpdates.subscribe(() => {
      this.fetchRoomData();
    });
    
    this.teamService.setTeamUsers(team_id);
  }
 
  closeTeamRoom() {
    this.team_id = null;
    this.currentTeam.next(null);
    this.teamUsersByMonth = [];
    this.teamUsersSelectedDate.next([]);
    this.tasks.next([]);
    this.roomUpdatesSubscribe.unsubscribe();
    document.title = "aTable";
  }

  fetchRoomData() {
    this.fetchTeam();
    this.fetchTasks();
    this.fetchTeamUsersByMonth();
  }

  fetchTeam() { // TEAM-ROOM CPOMP
    this.teamService.getTeamName(this.team_id).subscribe((team: TeamModel) => {
      this.currentTeam.next(team);

      document.title = "aTable | " + team.team_name;
    });
  }

  fetchTasks() { // TASKS COMP
    this.taskService.getTasks(this.team_id).subscribe((tasks: TaskModel[]) => {
      this.tasks.next(tasks);

      // this.cdf.detectChanges();

      // if (this.taskId) {
      //   this.atbTask.openTaskDetail(this.taskId);
      // }
    });
  }

  fetchTeamUsersByMonth(currentMonth?) {
    if (currentMonth) {
      this.currentMonth = currentMonth;
    }

    this.atableService.getTeamUsersByMonth(this.team_id, this.currentMonth).subscribe((teamUsers: AtableUserModel[]) => {
      this.teamUsersByMonth = teamUsers;
      this.parseSelectedDateTimes();

      // this.parseSelectedDateTimes();    SHOULD CALLED ON SUBSCRIBE IN ATABLE
    });
  }

  dateChange(date) {
    this.currentDate = date;
    this.parseSelectedDateTimes();
  }

  parseSelectedDateTimes() {
    let parsedTeamUsers = this.deepClone(this.teamUsersByMonth);
    
    for (let user of parsedTeamUsers) {
      user.atable_entries = user.atable_entries.filter( (atableTime) => {
        let atableTimeDate = moment(this.deepClone(atableTime.date));
        
        if (this.currentDate.isSame(atableTimeDate, "day")) {
          return atableTime;
        }
      });
      // for (let atableTime of user.atable_entries) {
      //   console.log(atableTime);
      //   let atableTimeDate = moment(atableTime.date);
      //   let atableTimeIndex = user.atable_entries.indexOf(atableTime);

      //   if (!this.currentDate.isSame(atableTimeDate, "day")) {
      //     user.atable_entries.splice(atableTimeIndex, 1);
      //   }
      // }
    }

    this.teamUsersSelectedDate.next(parsedTeamUsers);
  }

  deepClone(item) {
    return JSON.parse(JSON.stringify(item));
  }
}
