import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  onNotificationTaskClickEvent: EventEmitter<string> = new EventEmitter();
  
  onAtableAddTimeClickEvent: EventEmitter<any> = new EventEmitter();
  onAtableReadyEvent: EventEmitter<any> = new EventEmitter();

  onAddTaskClickEvent: EventEmitter<any> = new EventEmitter();

  constructor() { }

  onAtableAddTimeClick() {
    this.onAtableAddTimeClickEvent.emit();
  }
  
  onAddTaskClick() {
    this.onAddTaskClickEvent.emit();
  }

  onAtableReady() {
    this.onAtableReadyEvent.emit();
  }

  onNotificationTaskClick(task_id: string) {
    this.onNotificationTaskClickEvent.emit(task_id);
  }

  public copyToClipboard(text: string) {
    const selBox = document.createElement('textarea');
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}
