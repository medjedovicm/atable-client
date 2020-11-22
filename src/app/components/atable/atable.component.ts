import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, EventEmitter, Output, HostListener } from '@angular/core';
import { app_config } from 'app-config';
import { AtableUserModel, AtableTime } from 'src/app/models/AtableModel';
import { AtableService } from 'src/app/services/single-services/atable-service/atable.service';
import { Router } from '@angular/router';


import * as moment from "moment";
import { TeamService } from 'src/app/services/single-services/team-service/team.service';
import { UserService } from '../../services/single-services/user-service/user.service';
import { UserModel } from '../../models/UserModel';
import { TaskModel } from '../../models/TaskModel';
import { TeamRoomService } from '../../services/team-room-service/team-room.service';
import { EventService } from '../../services/event-service/event.service';
import { ThreadCommentModel } from 'src/app/models/ThreadCommentModel';

@Component({
  selector: 'atable',
  templateUrl: './atable.component.html',
  styleUrls: ['./atable.component.scss'],
})
export class AtableComponent implements OnInit, AfterViewInit {
  @Output("onFetchUsers") onFetchUsers: EventEmitter<any> = new EventEmitter<any>();
  @Output("onAtableReady") onAtableReady: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild("atableWrapper", { static: false }) atableWrapperElement: ElementRef;
  @ViewChild("atable", { static: false }) atableElement: ElementRef;

  user_id: string = localStorage.getItem('user_id');

  teamUsersProfiles: UserModel[] = [];
  tasks: TaskModel[] = [];

  currentUserProfile = this.userService.currentUserProfile;
  meUser: any;

  times: any[] = [];
  endTimes: string[] = [];
  startTimes: string[] = [];

  teamUsers: AtableUserModel[] = [];

  aTableTimes: AtableTime[] = [];

  aTableUserBeforeEdit: AtableTime = new AtableTime();
  aTableUserEditing: AtableTime = new AtableTime();
  aTableUserEditId: string = null;

  atableId: string;
  enteredComment: string = "";
  threadComment: ThreadCommentModel = new ThreadCommentModel()
  threadComments: ThreadCommentModel[] = []

  aTableUserCreating: AtableTime = new AtableTime();
  aTableLoading: boolean = false;
  aTableHeight: string = null;
  isViewInit: boolean = false;
  resizeDebounceTimer: any;
  pageLoading: boolean = true;
  atableTimesModal: boolean = false;
  threadModal: boolean = false;

  constructor(
    private atableService: AtableService,
    private userService: UserService,
    private eventService: EventService,
    private cdf: ChangeDetectorRef,
    private teamService: TeamService,
    private teamRoomService: TeamRoomService,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.times = app_config.data.times;

    this.teamRoomService.teamUsersSelectedDate.subscribe((teamUsers: AtableUserModel[]) => {
      if (teamUsers.length > 0) {
        this.teamUsers = teamUsers;

        this.cdf.detectChanges();

        if (!this.aTableHeight) {
          this.setAtableHeight();
          this.isViewInit = true;
        }

        this.teamUsersOnInput();
      }
    });

    this.teamRoomService.tasks.subscribe((tasks: TaskModel[]) => {
      this.tasks = tasks;
    });

    this.teamService.teamUserProfiles.subscribe((teamUsersProfiles: UserModel[]) => {
      this.teamUsersProfiles = teamUsersProfiles;
    });

    this.eventService.onAtableAddTimeClickEvent.subscribe(() => {
      this.addAtableTime();
    });
  }

  ngAfterViewInit() {

  }

  teamUsersOnInput() {
    let meUser = this.teamUsers.find(x => x._id === this.user_id);
    this.meUser = this.deepClone(meUser);

    this.setEntriesPosition();
    this.setStartTimesAvailable();

    this.aTableLoading = false;
    this.pageLoading = false;
    this.eventService.onAtableReady();
  }

  fetchUsers() {
    setTimeout(() => {
      this.onFetchUsers.emit();
    }, 500);
  }

  setEntriesPosition() {
    for (let teamUser of this.teamUsers) {
      for (let entry of teamUser.atable_entries) {
        entry['leftPosition'] = this.getLeftPosition(entry.start_time);
        entry['rightPosition'] = this.getRightPosition(entry.end_time);
      }
    }
  }

  setEditingEntryLeftPosition() {
    this.aTableUserEditing['leftPosition'] = this.getLeftPosition(this.aTableUserEditing.start_time);
  }

  setEditingEntryRightPosition() {
    this.aTableUserEditing['rightPosition'] = this.getRightPosition(this.aTableUserEditing.end_time);
  }

  setStartTimesAvailable() {
    this.startTimes = [];

    for (let time of this.times) {
      if (this.isStartTimeAvailable(time.hr)) {
        this.startTimes.push(time.hr);
      }
    }
  }

  isPositionInit(event) {
    if (event.style.left) {
      return true;
    } else {
      return false;
    }
  }

  setAtableHeight() {
    console.log(this.atableWrapperElement.nativeElement.clientHeight);
    this.aTableHeight = "-" + (this.atableWrapperElement.nativeElement.clientHeight - 20) + "px";
    this.pageLoading = false;
  }

  areMinutesZero(time) {
    return parseInt(time.split(':')[1]) === 0;
  }

  getLeftPosition(hrsStart: string) {
    if (this.isViewInit) {
      if (this.atableWrapperElement) {
        if (hrsStart.length > 0) {
          let parsedHrs = hrsStart.split(':')[0];
          let parsedMins = hrsStart.split(':')[1];

          let colHrElement = document.getElementById("t-" + parsedHrs + ':' + parsedMins);

          if (!colHrElement) {
            return null;
          }

          let hrElementLeft = colHrElement.offsetLeft;
          let parentElementLeft = this.atableWrapperElement.nativeElement.offsetLeft;

          let leftPosition = hrElementLeft - parentElementLeft;

          // return leftPosition - 40;
          return leftPosition;
        }
      }

      return null;
    }
  }

  getRightPosition(hrsEnd: string) {
    if (this.isViewInit) {
      if (this.atableWrapperElement) {
        if (hrsEnd.length > 0) {
          let parsedHrs = hrsEnd.split(':')[0];
          let parsedMins = hrsEnd.split(':')[1];

          // let hrElementOffsetLeft = this.getLeftPosition(parsedHrs + ":00") + 80;
          let hrElementOffsetLeft = this.getLeftPosition(parsedHrs + ":" + parsedMins);

          let parentElementWidth = this.atableWrapperElement.nativeElement.offsetWidth;

          let rightPosition = parentElementWidth - hrElementOffsetLeft;

          return rightPosition;
        }
      }

      return null;
    }
  }

  getProfileImage(user_id) {
    let teamUserProfile = this.teamUsersProfiles.find(usr => usr._id === user_id);

    if (!teamUserProfile) {
      return 'assets/dragislava.svg';
    }

    return teamUserProfile.profile_image;
  }

  isMe(user) {
    return this.user_id == user._id;
  }

  lessThen4h(start, end) {
    let startInt = parseInt(start);
    let endInt = parseInt(end);

    let result = endInt - startInt;

    if (result <= 4) {
      return true;
    }

    return false;
  }

  lessThen3h(start, end) {
    let startInt = parseInt(start);
    let endInt = parseInt(end);

    let result = endInt - startInt;

    if (result <= 3) {
      return result;
    }

    return false;
  }

  startTimeSelected(time, editAction?: boolean) {
    let editingEndTimeTemp = this.aTableUserEditing.end_time;
    let isOverlapping = false;

    let teamUserIndex = this.teamUsers.findIndex(x => x._id == this.user_id);
    // let atableUserEntries = this.teamUsers[teamUserIndex].atable_entries;

    this.endTimes.splice(0, this.endTimes.length);

    if (!editAction) {
      this.aTableUserEditing.end_time = "";
    }

    let timeToCheck = moment(time, "HH:mm").add({ minutes: 30 });
    let endTimeSelected = moment(editingEndTimeTemp, "HH:mm");

    let endOfTheDay;

    if (editAction) {
      endOfTheDay = moment("23:45", "HH:mm");
    } else {
      endOfTheDay = timeToCheck.isBefore(endTimeSelected) ? moment(editingEndTimeTemp, "HH:mm") : moment("23:45", "HH:mm");
    }

    let isTimeAvailable = true;

    while (isTimeAvailable) {
      isTimeAvailable = this.isEndTimeAvailable(timeToCheck.format("HH:mm"));

      if (!isTimeAvailable && !editAction) {
        isOverlapping = true;
      }

      if (isTimeAvailable) {
        if (timeToCheck.isSameOrBefore(endOfTheDay)) {
          this.endTimes.push(timeToCheck.format("HH:mm"));
        } else {
          isTimeAvailable = false;
        }
      }
      timeToCheck = timeToCheck.add({ minutes: 30 });
    }

    if (!editAction && isOverlapping) {
      this.aTableUserEditing.end_time = this.endTimes[this.endTimes.length - 1];
    }

    if (!isOverlapping) {
      this.aTableUserEditing.end_time = editingEndTimeTemp;
    }
  }

  countSumOfTime(atable) {
    let startTime = moment(atable.start_time, "HH:mm");
    let endTime = moment(atable.end_time, "HH:mm");

    let diffSeconds = endTime.diff(startTime, 'seconds');
    let diffHHMM = moment.utc(moment.duration(diffSeconds, "seconds").asMilliseconds()).format("HH:mm");

    let hrs = parseInt(diffHHMM.split(':')[0]);
    let mins = parseInt(diffHHMM.split(':')[1]);

    let stringToReturn;

    if (mins === 0) {
      stringToReturn = hrs + "h ";
    } else {
      stringToReturn = hrs + "h " + mins + "m";
    }

    return hrs < 2 ? hrs < 1 ? mins + "m" : stringToReturn : stringToReturn;
  }

  isStartTimeAvailable(time: moment.MomentInput) {
    let isAvailable = true;

    let startTimeToCheck = moment(time, "HH:mm");

    let teamUserIndex = this.teamUsers.findIndex(x => x._id == this.user_id);
    let atableUserEntries = this.teamUsers[teamUserIndex].atable_entries;

    for (let entry of atableUserEntries) {
      if (entry._id !== this.aTableUserEditId) {
        let entryStartMoment = moment(entry.start_time, "HH:mm");
        let entryEndMoment = moment(entry.end_time, "HH:mm");

        if (startTimeToCheck.isSame(entryStartMoment)) {
          isAvailable = false;
          break;
        } else {
          if (startTimeToCheck.isAfter(entryStartMoment) && startTimeToCheck.isBefore(entryEndMoment)) {
            isAvailable = false;
            break;
          }
        }
      }
    }

    return isAvailable;
  }

  isEndTimeAvailable(time) {
    let isAvailable = true;

    let endTimeToCheck = moment(time, "HH:mm");

    let teamUserIndex = this.teamUsers.findIndex(x => x._id == this.user_id);
    let atableUserEntries = this.teamUsers[teamUserIndex].atable_entries;

    for (let entry of atableUserEntries) {
      if (entry._id !== this.aTableUserEditId) {
        let entryStartMoment = moment(entry.start_time, "HH:mm");
        let entryEndMoment = moment(entry.end_time, "HH:mm");

        if (endTimeToCheck.isSame(entryEndMoment)) {
          isAvailable = false;
          break;
        } else {
          if (endTimeToCheck.isAfter(entryStartMoment) && endTimeToCheck.isBefore(entryEndMoment)) {
            isAvailable = false;
            break;
          }
        }
      }
    }

    return isAvailable;
  }

  findFirstAvailableRange() {
    let availableTime = null;

    for (let time of this.times) {
      if (this.isStartTimeAvailable(time.hr)) {
        availableTime = time.hr;
        break;
      }
    }

    if (availableTime) {
      this.aTableUserEditing.start_time = availableTime;
      this.startTimeSelected(availableTime);
    }
  }

  addAtableTime(user?) {
    user = user ? user : { _id: this.user_id };

    let teamUserIndex = this.teamUsers.findIndex(x => x._id == user._id);
    let newAtableTimeObject = {
      _id: "new",
      date: this.teamRoomService.currentDate.isSame(moment(), 'day') ? undefined : new Date(this.teamRoomService.currentDate.toDate()),
      start_time: "",
      end_time: "",
      description: "",
      task_id: null,
      user_id: this.user_id,
      team_id: this.teamRoomService.team_id
    };

    this.teamUsers[teamUserIndex].atable_entries.push(newAtableTimeObject);

    this.aTableUserEditing = newAtableTimeObject;
    this.aTableUserEditId = newAtableTimeObject._id;

    this.findFirstAvailableRange();

    this.atableTimesModal = true;

    this.setEditingEntryLeftPosition();
    this.setEditingEntryRightPosition();
    this.setStartTimesAvailable();

    this.cdf.detectChanges();
  }

  editATableTime(user_id, atable_id) {
    this.atableId = atable_id
    let teamUserIndex = this.teamUsers.findIndex(x => x._id == user_id);
    let aTableEntryIndex = this.teamUsers[teamUserIndex].atable_entries.findIndex(x => x._id === atable_id);

    let atableEntry = this.teamUsers[teamUserIndex].atable_entries[aTableEntryIndex];

    this.aTableUserBeforeEdit = JSON.parse(JSON.stringify(atableEntry));

    this.aTableUserEditing = atableEntry;
    this.aTableUserEditId = atableEntry._id;

    this.startTimeSelected(atableEntry.start_time, true);

    this.setStartTimesAvailable();

    this.atableTimesModal = true;
  }

  openTimeThread(atable_id: string) {
    console.log(atable_id)
    this.atableId = atable_id
    this.threadModal = true;
    this.getThreadComments()
    console.log('opened')
    // this.atableTimesModal = true;
  }

  cancelEditAtableTime(user?) {
    user = user ? user : this.meUser;

    if (this.aTableUserEditId === "new") {
      let teamUserIndex = this.teamUsers.findIndex(x => x._id == user._id);
      let aTableEntryIndex = this.teamUsers[teamUserIndex].atable_entries.findIndex(x => x._id === this.aTableUserEditId);

      this.teamUsers[teamUserIndex].atable_entries.splice(aTableEntryIndex, 1);
    }

    this.aTableUserEditing = JSON.parse(JSON.stringify(this.aTableUserBeforeEdit));

    this.exitEditingTime();

    this.fetchUsers();
  }

  exitEditingTime() {
    this.atableTimesModal = false;

    setTimeout(() => {
      this.aTableUserEditing = new AtableTime();
      this.aTableUserEditId = null;
      this.endTimes.splice(0, this.endTimes.length);
    }, 200);
  }

  saveAtableEntry() {
    if (this.aTableUserEditId === 'new') {
      this.atableService.createAtableTime(this.teamRoomService.team_id, this.aTableUserEditing).subscribe((res) => {
        console.log(res);

        this.exitEditingTime();
        this.fetchUsers();
      }, error => {
        console.log(error);
      });
    } else {
      console.log(this.aTableUserEditing);
      this.atableService.updateAtableTime(this.teamRoomService.team_id, this.aTableUserEditId, this.aTableUserEditing).subscribe((res) => {
        console.log(res);

        this.exitEditingTime();
        this.fetchUsers();
      }, error => {
        console.log(error);
      });
    }
  }

  removeAtableEntry(aTableUserEditing: AtableUserModel) {
    let teamUserIndex = this.teamUsers.findIndex(x => x._id == this.meUser._id);
    let aTableEntryIndex = this.teamUsers[teamUserIndex].atable_entries.findIndex(x => x._id === this.aTableUserEditId);

    this.teamUsers[teamUserIndex].atable_entries.splice(aTableEntryIndex, 1);

    this.atableService.removeAtableTime(this.aTableUserEditId).subscribe(res => {
      console.log(res);

      this.exitEditingTime();
      this.fetchUsers();
    });
  }

  drop(event) {
    console.log(event);
  }

  dragOverTime(event, time) {
    console.log(event);
    console.log(time);
  }

  trackByItems(index: number, item: any): number { return item._id; }

  deepClone(item: any) {
    return JSON.parse(JSON.stringify(item));
  }

  openProfile(user_id) {
    this.router.navigateByUrl('auth/profile/' + user_id + '?return=' + this.teamRoomService.team_id);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    clearTimeout(this.resizeDebounceTimer);

    this.resizeDebounceTimer = setTimeout(() => {
      this.setEntriesPosition();
    }, 150);
  }


  addThreadComment() {
    this.threadComment = new ThreadCommentModel();
    this.threadComment.team_id = this.teamRoomService.team_id;
    this.threadComment.content = this.enteredComment;
    this.threadComment.user_id = this.user_id;
    this.threadComment.atable_id = this.atableId

    // pitanje -> zasto ovo nismo radili do sad, za instant response/kvalitetniji UX onog koji postavlja komentar?
    this.threadComments.push(this.threadComment)

    this.atableService.postThreadComment(this.atableId, this.threadComment).subscribe((res) => {
      this.enteredComment = "";
      this.threadComment = new ThreadCommentModel();
    })
  }

  getThreadComments() {
    this.atableService.getThreadComments(this.atableId).subscribe((res: any) => {
      console.log(res)
      this.threadComments = res
    })
  }
}

