import { Component, OnInit, Input, HostBinding, HostListener, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'atb-modal',
  templateUrl: './atb-modal.component.html',
  styleUrls: ['./atb-modal.component.scss']
})
export class AtbModalComponent implements OnInit {
  @HostBinding('class.visible')
  @Input() visible: boolean = false;
  
  @Output() visibleChange = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  hideModal() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.hideModal();
  }
}
