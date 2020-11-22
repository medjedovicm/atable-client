import { Component, OnInit, AfterContentInit, ViewChild, ChangeDetectorRef, OnDestroy, HostListener } from '@angular/core';
import { TeamService } from '../../../services/single-services/team-service/team.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AtableUserModel } from '../../../models/AtableModel';
import { AtableService } from '../../../services/single-services/atable-service/atable.service';
import { AtbChatComponent } from '../../../components/atb-chat/atb-chat.component';
import { SocketService } from '../../../services/socket-service/socket.service';
import { ChatModel } from '../../../models/ChatModel';
import * as moment from "moment";
import { UserModel } from '../../../models/UserModel';
import { TeamModel } from '../../../models/TeamModel';
import { TaskService } from '../../../services/single-services/task-service/task.service';
import { EventService } from '../../../services/event-service/event.service';
import { TeamRoomService } from '../../../services/team-room-service/team-room.service';
import * as electronNotif from '../../../../electron-notif.js'
import { ElectronService } from '../../../services/electron-service/electron.service';

@Component({
  selector: 'app-team-room',
  templateUrl: './team-room.component.html',
  styleUrls: ['./team-room.component.scss']
})
export class TeamRoomComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild("atbChat") atbChat: AtbChatComponent;

  atableReady: boolean = false;
  chatReady: boolean = false;

  modalTest: boolean = false;
  inviteUrl: string = "";
  teamId: string = "";

  team: TeamModel = new TeamModel();
  inviteCopied: boolean = false;
  message: string = "";
  messages: ChatModel[] = [];
  messagesSocketSubscribe;
  user_id = localStorage.getItem("user_id");

  currentMonth: number = moment().month() + 1;
  currentDate = moment();
  teamUsersSelectedDate: AtableUserModel[] = [];

  datePickerDate = new Date();

  teamUsersProfiles: UserModel[] = [];

  keyboardEventListen: boolean = true;

  constructor(
    private atableService: AtableService,
    private teamService: TeamService,
    private taskService: TaskService,
    private eventService: EventService,
    private teamRoomService: TeamRoomService,
    public router: Router,
    private route: ActivatedRoute,
    private socketService: SocketService,
    private electronService: ElectronService,
    private cdf: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.teamId = params.id;

      if (this.router.url.includes('tasks')) {
        this.atableReady = true;
      }
    });
    
    this.teamRoomService.openTeamRoom(this.teamId);

    this.socketService.enterRoom(this.teamId);
    this.subscribeOnNewMessages();

    this.eventService.onAtableReadyEvent.subscribe(() => {
      this.atableReady = true;
    });

    this.teamService.teamUserProfiles.subscribe((teamUsersProfiles: UserModel[]) => {
      this.teamUsersProfiles = teamUsersProfiles;
    });

    this.teamRoomService.currentTeam.subscribe((team: TeamModel) => {
      if (team) {
        this.team = team;
      }
    });

    this.teamRoomService.teamUsersSelectedDate.subscribe((teamUsers: AtableUserModel[]) => {
      this.teamUsersSelectedDate = teamUsers;
    });
  }

  ngAfterContentInit(): void {

  }

  isMe(userId: string) {
    return this.user_id === userId;
  }

  subscribeOnNewMessages() {
    this.messagesSocketSubscribe = this.socketService.messagesSubject.subscribe((res: any) => {
      let command = res['command'];
      let value = res['value'];

      switch (command) {
        case "fetch_messages": {
          this.messages = value;
          this.atbChat.scrollToBottom();

          break;
        }

        case "new_message": {
          let userAgent = navigator.userAgent.toLowerCase();
          let tempMessages = this.deepClone(this.messages);
          tempMessages.push(value);
          this.messages = tempMessages;
          this.atbChat.scrollToBottom();
          // if (userAgent.indexOf(' electron/') > -1 && !this.isMe(value.user_id)) {
          //   electronNotif.doNotify(value.content, value.username);
          // }
          if (this.electronService.isElectron && !this.isMe(value.user_id)) {
            this.electronService.ipcRenderer.invoke('new-message-notify', value);
          } else {
            console.log('Mode web');
          }
          break;
        }
        case "paginate": {
          if (value.length > 0) {
            let tempMessages = this.deepClone(this.messages);
            tempMessages.unshift(...value);
            this.messages = tempMessages;
          }

          break;
        }
      }
    });
  }

  get currentUrl() {
    return this.router.url;
  }

  openAtable() {
    this.router.navigate(['atable'], { relativeTo: this.route });
  }

  openTasks() {
    this.router.navigate(['tasks/list'], { relativeTo: this.route });
  }

  public sendMessage(message) {
    let newMessage = new ChatModel();

    newMessage.content = message;
    newMessage.team_id = this.teamId;
    newMessage.user_id = this.user_id;

    this.socketService.newChatMessage(newMessage);
  };

  public loadMoreMessages(last_message_id: string) {
    this.socketService.loadMoreMessages();
  }

  generateInviteUrl() {
    this.teamService.generateInviteUrl(this.teamId);

    this.inviteCopied = true;
    setTimeout(() => {
      this.inviteCopied = false;
    }, 1000);
  }

  chatFocusIn() {
    this.keyboardEventListen = false;
  }

  chatFocusOut() {
    this.keyboardEventListen = true;
  }

  getCurrentDate() {
    return this.currentDate.format('dddd, Do MMMM');
  }

  isDateToday(datePickerDate: any) {
    return moment(datePickerDate).isSame(moment(), 'day');
  }

  dateNext() {
    this.currentDate.add(1, "day");
    this.teamRoomService.dateChange(this.currentDate);
    this.datePickerDate = new Date(this.currentDate.toDate());

    let nextMonth = this.currentDate.month() + 1;

    if (nextMonth != this.currentMonth) {
      this.currentMonth = nextMonth;
      this.teamRoomService.fetchTeamUsersByMonth(this.currentMonth);
    }
  }

  datePrev() {
    this.currentDate.subtract(1, "day");
    this.teamRoomService.dateChange(this.currentDate);
    this.datePickerDate = new Date(this.currentDate.toDate());

    let nextMonth = this.currentDate.month() + 1;

    if (nextMonth != this.currentMonth) {
      this.currentMonth = nextMonth;
      this.teamRoomService.fetchTeamUsersByMonth(this.currentMonth);
    }
  }

  onDateChange(value) {
    this.currentDate = moment(value);
    this.teamRoomService.dateChange(this.currentDate);
    let nextMonth = this.currentDate.month() + 1;

    if (nextMonth != this.currentMonth) {
      this.currentMonth = nextMonth;
      this.teamRoomService.fetchTeamUsersByMonth(this.currentMonth);
    }
  }

  dateGotoToday(picker?) {
    this.datePickerDate = new Date();
    this.cdf.detectChanges();
  }

  addAtableTime() {
    this.eventService.onAtableAddTimeClick();
  }

  addTaskClick() {
    this.eventService.onAddTaskClick();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.keyboardEventListen && this.router.url.includes('atable')) {
      if (event.code == "ArrowLeft") {
        this.datePrev();
      }

      if (event.code == "ArrowRight") {
        this.dateNext();
      }

      if (event.code == "Escape") {
        this.dateGotoToday();
      }
    }
  }

  deepClone(item) {
    return JSON.parse(JSON.stringify(item));
  }

  onComponentDestroy() {
    this.socketService.leaveRoom(this.teamId);
    this.socketService.stopTyping();
    this.teamRoomService.closeTeamRoom();
    this.messagesSocketSubscribe.unsubscribe();
  }

  ngOnDestroy() {
    this.onComponentDestroy();
  }

  @HostListener('window:beforeunload')
  onDestroy() {
    this.onComponentDestroy();
  }
}
