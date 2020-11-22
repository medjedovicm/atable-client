import {
  AfterContentInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ChatModel } from '../../models/ChatModel';
import * as electronNotif from '../../../electron-notif.js'
import * as moment from "moment";
import { SocketService } from '../../services/socket-service/socket.service';
import { UserService } from '../../services/single-services/user-service/user.service';
import { UserModel } from '../../models/UserModel';
import { ElectronService } from 'src/app/services/electron-service/electron.service';

@Component({
  selector: 'atb-chat',
  templateUrl: './atb-chat.component.html',
  styleUrls: ['./atb-chat.component.scss'],
})
export class AtbChatComponent implements OnInit, AfterContentInit, OnChanges {
  @ViewChild('atbChat', { static: true }) atbChat: ElementRef;
  @ViewChild("messageInput", { static: true }) messageInput: ElementRef;

  @Input() teamUsersProfiles: UserModel[] = [];
  @Input() usersTyping: string[] = [];

  @Output() onSendMessage: EventEmitter<string> = new EventEmitter<string>();
  @Output() onLoadMore: EventEmitter<any> = new EventEmitter<any>();
  @Output() onChatReady: EventEmitter<any> = new EventEmitter<any>();
  currentUserProfile = this.userService.currentUserProfile;

  loadMoreHitted: boolean = false;
  oldMessages: ChatModel[] = [];
  messageTextareaHeight: string = "30px";
  confirmDeleteMessage: boolean = false;

  _messages: ChatModel[] = [];
  get messages(): ChatModel[] {
    return this._messages;
  }

  @Input("messages")
  set messages(value: ChatModel[]) {
    if (this._messages.length > 0) {
      this.oldMessages = this.deepClone(this._messages);
    } else {
      this.oldMessages = this.deepClone(value);
    }

    this._messages = value;

    for (let message of this._messages) {
      message['groupMessage'] = this.groupMessage(message);
      message['isMe'] = this.isMe(message.user_id);
      message['profileImage'] = this.getProfileImage(message.user_id);
    }

    if (this.loadMoreHitted) {
      this.loadMoreHitted = false;
    }

    this.cdf.detectChanges();

    if (this.oldMessages.length !== this._messages.length) {
      console.log("SCROLL TO LAST");
      this.atbChat.nativeElement.scrollTop = this.atbChat.nativeElement.scrollHeight - this.lastLoadingScroll;
    }
  }

  _loading: boolean = true;
  get loading(): boolean {
    return this._loading;
  }

  @Input("loading")
  set loading(value: boolean) {
    this._loading = value;
  }

  userId = localStorage.getItem("user_id");
  message: string = "";

  lastLoadingScroll = null;
  chatDropdownX = 0;
  chatDropdownY = 0;

  onlyMeTyping: boolean = false;

  msgDropdownDate = "";
  msgDropdown: ChatModel = null;

  isTyping: boolean = false;

  constructor(
    private userService: UserService,
    private chatService: SocketService,
    private cdf: ChangeDetectorRef,
    private socketService: SocketService,
    private electronService: ElectronService
  ) { }

  ngOnInit() {

  }

  ngAfterContentInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.usersTyping) {
      let currentUsersTyping = changes.usersTyping.currentValue;

      if (currentUsersTyping.length === 1 && currentUsersTyping[0] === this.userId) {
        this.onlyMeTyping = true;
      } else {
        this.onlyMeTyping = false;
      }
    }
  }

  isMe(userId) {
    if (this.userId == userId) {
      return true;
    }
    return false;
  }

  getProfileImage(user_id) {
    let teamUserProfile = this.teamUsersProfiles.find(usr => usr._id === user_id);

    if (!teamUserProfile) {
      return 'assets/dragislava.svg';
    }

    return teamUserProfile.profile_image;
  }

  // getTimeElapsed(timestamp) {
  //   let msgTime = moment(timestamp);

  //   if (!msgTime) {
  //     return "0";
  //   }

  //   let minutesElapsed = moment().diff(msgTime, "minutes");
  //   let hoursElapsed = moment().diff(msgTime, "hours");
  //   let daysElapsed = moment().diff(msgTime, "days");
  //   let monthsElapsed = moment().diff(msgTime, "month");
  //   let yearsElapsed = moment().diff(msgTime, "year");

  //   if (yearsElapsed >= 1) {
  //     return yearsElapsed < 2 ? yearsElapsed + "yr ago" : yearsElapsed + "yrs ago";
  //   }
  //   if (monthsElapsed >= 1) {
  //     return monthsElapsed + "mo ago";
  //   }
  //   if (daysElapsed >= 1) {
  //     return daysElapsed + "d ago";
  //   }
  //   if (hoursElapsed >= 1) {
  //     return hoursElapsed + "h ago";
  //   }
  //   if (minutesElapsed >= 1) {
  //     return minutesElapsed + "m ago";
  //   }
  //   if (minutesElapsed < 1) {
  //     return "Just now"
  //   }

  //   //TODO: ovo je mihajlovo i ovo ne valja
  //   // if (isSameDay) {
  //   //   returnValue = msgTime.format("HH:mm");
  //   // } else {
  //   //   returnValue = msgTime.format("MMM DD, HH:mm");
  //   // }
  //   // return returnValue;
  // }

  scrollToBottom() {
    setTimeout(() => {
      console.log("SKROL");
      this.atbChat.nativeElement.scrollTop = this.atbChat.nativeElement.scrollHeight;

      this.onChatReady.emit();
    }, 10);
  }

  onChatMessageKeyDown(event) {
    this.chatOnEnter(event);
  }

  chatOnEnter(event) {
    if (event.keyCode == 13 && !event.shiftKey) {
      event.preventDefault();

      this.sendMessage();
    }

    // this.message = event.target.value;

    if (event.shiftKey && event.keyCode == 13) {
      console.log("NEW LINE");

      // event.target.value += "<br>";

      // this.message += "<br/>";
    }
  }

  debouncingOnInput: boolean = false;
  setMessageInputHeight(event) {
    if (!this.debouncingOnInput) {
      let inputElement = event.target;

      this.messageTextareaHeight = "";
      this.cdf.detectChanges();
      this.messageTextareaHeight = Math.min(inputElement.scrollHeight) + "px";

      this.debouncingOnInput = true;
      setTimeout(() => { this.debouncingOnInput = false }, 300);
    }
  }

  public messageOnInput(event) {
    this.setMessageInputHeight(event);

    if (this.message.length > 0 && !this.isTyping) {
      this.startTyping();
    }

    if (this.message.length < 1 && this.isTyping) {
      this.stopTyping();
    }
  }

  stopTyping() {
    this.socketService.stopTyping();
    this.isTyping = false;
  }

  startTyping() {
    this.socketService.startTyping();
    this.isTyping = true;
  }

  sendMessage() {
    let msgValue = this.messageInput.nativeElement.value;
    if (msgValue.length > 0) {
      let msgValueForHtml = msgValue.replace(new RegExp('\n', 'g'), '<br/>');

      this.onSendMessage.emit(msgValueForHtml);
      this.messageInput.nativeElement.value = "";
      this.messageTextareaHeight = "30px";
      this.message = "";
      this.stopTyping();
    }
  }

  chatScroll(event) {
    if (event.target.scrollTop <= 1 && !this.loadMoreHitted) {
      console.log("load more");
      this.loadMoreHitted = true;

      this.lastLoadingScroll = event.target.scrollHeight;

      setTimeout(() => {
        this.onLoadMore.emit(this.messages[0]._id);
      }, 500);

      // setTimeout(() => {
      //   this.loadMoreHitted = false;
      // }, 500);
    }

    // if(this.loadMoreHitted) {
    //   if (!this.loading && event.target.scrollTop > 10) {
    //     console.log(event.target.scrollTop);
    //     if (this.lastLoadingScroll === null) {
    //       this.lastLoadingScroll = event.target.scrollTop;
    //     }

    //     console.log(this.lastLoadingScroll);
    //   }

    //   event.target.scrollTop = this.lastLoadingScroll ? this.lastLoadingScroll: event.target.scrollTop;
    // }
  }

  openMsgOptions(event, msg) {
    event.stopPropagation();
    let box = event.target.getBoundingClientRect();

    this.chatDropdownX = box.x;
    this.chatDropdownY = box.y;

    this.msgDropdown = msg;
    this.msgDropdownDate = moment(msg.timestamp).format("MMM DD, HH:mm");
  }

  groupMessage(message: ChatModel) {
    let messageIndex = this.messages.indexOf(message);

    if (messageIndex > 0) {
      let previousMessage: ChatModel = this.messages[messageIndex - 1];

      let messageTime = moment(message.timestamp);
      let previousMessageTime = moment(previousMessage.timestamp);

      if (message.user_id === previousMessage.user_id) {
        if (messageTime.diff(previousMessageTime, "minutes") <= 3) {
          return true;
        }
      }
    }

    return false;
  }


  confirmMessageDelete() {
    let removingMessageIndex = this.messages.findIndex(msg => msg._id === this.msgDropdown._id);
    this.messages.splice(removingMessageIndex, 1);

    this.chatService.deleteMessage(this.msgDropdown._id);
    this.confirmDeleteMessage = false;
  }

  deleteMessageModalToggle() {
    this.confirmDeleteMessage = !this.confirmDeleteMessage;
  }

  deepClone(item) {
    return JSON.parse(JSON.stringify(item));
  }

  onFocus() {
    if (this.electronService.isElectron) {
      this.electronService.ipcRenderer.invoke('notify-read');
    }
  }
}
