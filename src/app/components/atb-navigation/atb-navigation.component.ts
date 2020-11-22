import { Component, OnInit, Input, ViewChild, ElementRef, ContentChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations'
import { AuthService } from 'src/app/services/single-services/auth-service/auth.service';
import { TeamService } from 'src/app/services/single-services/team-service/team.service';
import { Router } from '@angular/router'
import {ActivatedRoute} from '@angular/router';

import { environment } from './../../../environments/environment';
import { UserService } from '../../services/single-services/user-service/user.service';
import { SocketService } from '../../services/socket-service/socket.service';
import { NotificationModel } from '../../models/NotificationModel';
import * as moment from 'moment';
import { EventService } from '../../services/event-service/event.service';

@Component({
  selector: 'atb-navigation',
  templateUrl: './atb-navigation.component.html',
  styleUrls: ['./atb-navigation.component.scss'],
  animations: [
    trigger('menuVisibility', [
      state('opened', style({ opacity: 1, display: 'block' })),
      state('closed', style({ opacity: 0, display: 'none'})),
      transition('opened => closed', animate('100ms')),
      transition('closed => opened', [style({display: 'block'}), animate('100ms')]),
    ])
  ]
})
export class AtbNavigationComponent implements OnInit {
  @Input('menuOpen') menuOpen: string = "closed";
  
  @ViewChild('atbMenuDropdown') atbMenuDropdown: ElementRef;
  @ViewChild('atbNotificationsDropdown') atbNotificationsDropdown: ElementRef;

  notificationsOpen: string = "closed";

  isProduction: boolean = environment.production;

  teamId: string = "";
  user_id = localStorage.getItem('user_id');
  team_name: string = "";
  inviteCopied: boolean = false;

  currentUserProfile = this.userService.currentUserProfile;

  notifications: NotificationModel[] = [];
  unreadNotifications: string[] = [];
  routerUrl: string;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private teamService: TeamService,
    private socketService: SocketService,
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute,
    private cdf: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.routerUrl = this.router.url;

    this.route.params.subscribe(params => {
      if (this.router.url.includes('team-room')) {
        this.teamId = params.id;
      }
    });

    this.subscribeOnNewNotifications();
  }

  subscribeOnNewNotifications() {
    this.socketService.notificationsSubject.subscribe((res: any) => {
      let command = res['command'];
      let value = res['value'];
      console.log(res)
      switch (command) {
        case "fetch": {
          this.notifications = value;

          this.parseUnreadNotifs();

          break;
        }
        case "new": {
          if (!value.users_read.includes(this.user_id)) {
            this.unreadNotifications.push(value._id);
            value['isUnread'] = true;
          }

          let tempNotifications = this.deepClone(this.notifications);
          tempNotifications.unshift(value);
          this.notifications = tempNotifications;
          break;
        }
      }
    })
  }

  parseUnreadNotifs() {
    if (this.notifications.length > 0) {
      for (let i = 0; i < this.notifications.length; i++) {
        if (!this.notifications[i].users_read.includes(this.user_id)) {
          if (!this.unreadNotifications.includes(this.notifications[i]._id)) {
            this.unreadNotifications.push(this.notifications[i]._id);
          }

          this.notifications[i]['isUnread'] = true;
        } else {
          this.notifications[i]['isUnread'] = false;
        }
      }
    }
  }

  parseDate(timestamp: Date) {
    return moment(timestamp).format("MMM DD");
  }

  readNotifs() {
    this.socketService.readNotification(this.unreadNotifications);
    this.unreadNotifications = [];
  }

  notificationOnClick(notification: NotificationModel) {
    if (notification.task_id){      
      // this.eventService.onNotificationTaskClick(notification.task_id);
      this.router.navigateByUrl("/auth/team-room/" + this.teamId + '/tasks/' + notification.task_id);
    }
  }

  goToProfile() {
    this.router.navigateByUrl('auth/profile/' + this.user_id)
  }

  toggleLock = false;
  public toggleMenu(open?: boolean) {
    if (!this.toggleLock) {
      if (open === undefined) {
        this.menuOpen = this.menuOpen === "closed" ? "opened" : "closed";
        
        if (this.menuOpen === "opened") {
          setTimeout(() => {this.atbMenuDropdown.nativeElement.focus();}, 100);
        }
  
        this.toggleLock = true;
        setTimeout(() => {this.toggleLock = false;}, 200);
      } else {
        this.menuOpen = open ? "opened" : "closed";
      }
    }
  }

  public closeMenu() {
    this.toggleMenu(false);
  }

  public closeNotifications() {
    this.toggleNotifications(false);
  }

  toggleNotificationsLock = false;
  public toggleNotifications(open?: boolean) {
    if (!this.toggleNotificationsLock) {
      if (open === undefined) {
        this.notificationsOpen = this.notificationsOpen === "closed" ? "opened" : "closed";
          
        if (this.notificationsOpen === "opened") {
          setTimeout(() => {this.atbNotificationsDropdown.nativeElement.focus();}, 100);
  
          if (this.unreadNotifications.length > 0) {
            setTimeout(() => {
              this.readNotifs();
            }, 3000);
          }
        }
  
        this.toggleNotificationsLock = true;
        setTimeout(() => {this.toggleNotificationsLock = false;}, 200);
      } else {
        this.notificationsOpen = open ? "opened" : "closed";
      }
    }
  }

  public logout() {
    this.authService.logout();
  }

  public showLink() {
    return this.router.url.includes('team-room')
  }

  generateInviteUrl() {
    this.teamService.generateInviteUrl(this.teamId);

    this.inviteCopied = true;
    setTimeout(() => {
      this.inviteCopied = false;
    }, 1000);
  }

  deepClone(item: any) {
    return JSON.parse(JSON.stringify(item));
  }
}
