import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Location } from '@angular/common';
import { TaskModel, TaskCommentModel } from '../../models/TaskModel';
import { TaskService } from '../../services/single-services/task-service/task.service';
import { UserService } from '../../services/single-services/user-service/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SocketService } from '../../services/socket-service/socket.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { EventService } from '../../services/event-service/event.service';
import { TeamRoomService } from '../../services/team-room-service/team-room.service';
import { TeamService } from '../../services/single-services/team-service/team.service';
import { UserModel } from '../../models/UserModel';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'atb-task',
  templateUrl: './atb-task.component.html',
  styleUrls: ['./atb-task.component.scss']
})
export class AtbTaskComponent implements OnInit {
  @Output('onFetchTasks') onFetchTasks: EventEmitter<any> = new EventEmitter();

  user_id: string = localStorage.getItem('user_id');
  task_id_param: string | null = null;
  tasks: TaskModel[] = [];

  enteredComment: string = "";

  taskModal: boolean = false;
  taskDetail: TaskModel = new TaskModel();
  editingTask: TaskModel = new TaskModel();
  taskUnedited: TaskModel = new TaskModel();

  taskComments: TaskCommentModel[] = [];
  newTaskComment: TaskCommentModel = new TaskCommentModel();
  commentsSubscribe: Subscription;
  isTaskCommentsLoading: boolean = true;

  teamUserProfiles: UserModel[] = [];
  
  currentDate: string = moment().format('LLL');

  assignedUsers = new FormControl();

  constructor(
    private teamRoomService: TeamRoomService,
    private teamService: TeamService,
    private taskService: TaskService,
    private userService: UserService,
    private socketService: SocketService,
    private eventService: EventService,
    public router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.teamRoomService.tasks.subscribe((tasks: TaskModel[]) => {
      this.tasks = tasks;
      if (this.task_id_param) {
        this.openTaskDetail(this.task_id_param);
      }
    });

    this.teamService.teamUserProfiles.subscribe((teamUserProfiles: UserModel[]) => {
      this.teamUserProfiles = teamUserProfiles;
    });

    this.eventService.onAddTaskClickEvent.subscribe(() => {
      this.onAddTaskClick();
    });

    this.route.params.subscribe((params: any) => {
      if (params.task_id !== 'list') {
        this.task_id_param = params.task_id;

        this.openTaskDetail(this.task_id_param);
      } else {
        this.task_id_param = null;
        this.teamRoomService.fetchTasks();
      }
    });
  }

  fetchTasks() {
    this.teamRoomService.fetchTasks();
  }

  onAddTaskClick() {
    this.editingTask = new TaskModel();
    this.editingTask._id = 'new';
    this.taskModal = true;
  }

  onEditTaskClick() {
    this.editingTask = this.deepClone(this.taskDetail);
    this.taskModal = true;
  }

  onCancelTaskClick() {
    this.taskModal = false;
    this.editingTask = new TaskModel();
  }

  deleteTask() {
    this.taskService.removeTask(this.taskDetail._id).subscribe(() => {
      this.closeTaskDetail();
      this.fetchTasks();
      this.taskModal = false;
    });
  }

  createTask() {
    if (this.editingTask._id !== 'new') {
      this.taskService.updateTask(this.editingTask).subscribe(res => {
        console.log(res);
  
        this.taskModal = false;
        this.fetchTasks();
      });
    } else {
      this.taskService.createTask(this.teamRoomService.team_id, this.editingTask).subscribe(res => {
        console.log(res);
  
        this.taskModal = false;
        this.fetchTasks();
      });
    }
  }

  getProfileImage(filename: string) {
    return this.userService.getProfileImageUrl(filename);
  }

  navigateToTaskDetail(task_id: string) {
    this.router.navigate(['../../tasks/' + task_id], {relativeTo: this.route});
  }

  openTaskDetail(task_id: string, updateRoute?: boolean) {
    let task = this.tasks.find(x => x._id === task_id);
    console.log("TASK", task);
    if (task) {
      this.taskDetail = task;
    }
    this.getTaskComments();
    this.subscribeToNewComments();
  }

  closeTaskDetail() {
    this.router.navigate(['../../tasks/list'], {relativeTo: this.route});
    this.taskDetail = new TaskModel();
    this.commentsSubscribe.unsubscribe();
  }

  copyTaskUrl(task: TaskModel, copiedTooltip) {
    this.eventService.copyToClipboard(location.href.replace('/list', '') + '/' + task._id);

    copiedTooltip.open();
    setTimeout(() => {copiedTooltip.close()}, 1000);
  }

  subscribeToNewComments() {
    this.commentsSubscribe = this.socketService.newComments.subscribe(() => {
      this.getTaskComments();
    });
  }

  getTaskComments() {
    this.taskService.getComments(this.taskDetail._id).subscribe((taskComments: TaskCommentModel[]) => {
      console.log(taskComments)

      this.taskComments = taskComments;

      this.isTaskCommentsLoading = false;
    });
  }


  postTaskComment() {
    this.newTaskComment = new TaskCommentModel();
    this.newTaskComment.task_id = this.taskDetail._id;
    this.newTaskComment.team_id = this.teamRoomService.team_id;
    this.newTaskComment.content = this.enteredComment;
    this.newTaskComment.user_id = this.user_id;

    this.taskService.createComment(this.taskDetail._id, this.newTaskComment).subscribe((res) => {
      console.log(res)

      this.enteredComment = "";
      this.newTaskComment = new TaskCommentModel();
    })
  }

  goToUserProfile(id: string) {
    this.router.navigateByUrl(`auth/profile/${id}?return=${this.teamRoomService.team_id}`);
  }

  deepClone(item: any) {
    return JSON.parse(JSON.stringify(item));
  }
}
