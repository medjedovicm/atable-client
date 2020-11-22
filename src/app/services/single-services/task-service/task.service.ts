import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { TaskModel } from '../../../models/TaskModel';
import { TaskCommentModel } from '../../../models/TaskModel'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private http: HttpClient
  ) { }
  
  getTasks(team_id: string): Observable<TaskModel[]> {
      return this.http.get<TaskModel[]>(environment.api.url + 'tasks/' + team_id);
  }
  
  updateTask(task: TaskModel) {
    return this.http.put(environment.api.url + 'tasks/' + task._id, task);
  }
  
  createTask(team_id: string, task: TaskModel) {
    return this.http.post(environment.api.url + 'tasks/' + team_id, task);
  }
  
  removeTask(id: string) {
    return this.http.delete(environment.api.url + 'tasks/' + id);
  }

  createComment(task_id: string, comment: TaskCommentModel) {
    console.log(comment)
    return this.http.post(environment.api.url + 'tasks/comment/' + task_id, comment);
  }

  getComments(task_id: string): Observable<TaskCommentModel[]> {
    return this.http.get<TaskCommentModel[]>(environment.api.url + 'tasks/comment/' + task_id)
  }
}
