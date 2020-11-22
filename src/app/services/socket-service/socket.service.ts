import { Injectable, EventEmitter } from '@angular/core';
import {Subject} from 'rxjs';
import {ChatModel} from '../../models/ChatModel';
import {environment} from '../../../environments/environment';
import * as io from 'socket.io-client';
import { Socket } from 'socket.io-client';
import { NotificationModel } from '../../models/NotificationModel';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  baseUrl = `${environment.api.url.replace('/api/', '')}`;

  public newTeamUpdates: EventEmitter<any> = new EventEmitter();
  public newComments: EventEmitter<any> = new EventEmitter();

  public messagesSubject = new Subject();
  public notificationsSubject = new Subject();

  private socket: Socket;
  team_id: string;
  user_id: string;

  constructor(
  ) { }

  enterRoom(team_id: string){
    this.user_id = localStorage.getItem('user_id');
    this.team_id = team_id;

    if (!this.socket || !this.socket?.connected) {
      this.socket = io(this.baseUrl);
      this.registerRoomListeners();
    }

    this.socket.emit('enter_team_room', this.team_id, this.user_id);
    this.socket.emit("fetch_messages", this.team_id);
    this.fetchNotifications();
  }

  leaveRoom(team_id: string) {
    this.socket.emit('leave_team_room', this.team_id, this.user_id);
    this.socket.disconnect();
  } 

  registerRoomListeners() {
    this.socket.on('new_message', (message: ChatModel) => {
      this.messagesSubject.next({
        command: 'new_message',
        value: message
      });
    });

    this.socket.on('fetch_messages', (messages: ChatModel[]) => {
      this.messagesSubject.next({
        command: 'fetch_messages',
        value: messages
      });
    });

    this.socket.on('paginate', (messages: ChatModel[]) => {
      this.messagesSubject.next({
        command: 'paginate',
        value: messages
      });
    });

    this.socket.on('fetch_notifications', (notifications: NotificationModel[]) => {
      this.notificationsSubject.next({
        command: 'fetch',
        value: notifications
      });
    });

    this.socket.on('new_notification', (notification: NotificationModel) => {
      this.playSound();
      
      this.notificationsSubject.next({
        command: 'new',
        value: notification
      });
    });

    this.socket.on('new_room_updates', () => {
      this.newTeamUpdates.emit();
    });

    this.socket.on('new_comments', () => {
      this.newComments.emit();
    });
  }

  startTyping() {
    this.socket.emit('typing_start', this.team_id, this.user_id);
  }

  stopTyping() {
    this.socket.emit('typing_stop', this.team_id, this.user_id);
  }

  newChatMessage(message) {
    this.socket.emit('new_message', message);
  }

  loadMoreMessages() {
    this.socket.emit('paginate', this.team_id);
  }

  deleteMessage(message_id) {
    this.socket.emit('delete_message', {message_id: message_id, team_id: this.team_id});
  }

  fetchNotifications() {
    this.socket.emit("fetch_notifications", this.team_id);
  }

  readNotification(notification_ids: string[]) {
    this.socket.emit('read_notifications_multi', notification_ids, this.user_id, () => {
      this.fetchNotifications();
    });
  }

  playSound() {
    let audio = new Audio('assets/woodblock.mp3');
    audio.play();
  }
}
