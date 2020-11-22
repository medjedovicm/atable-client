import {Component, OnInit, Input, HostBinding} from '@angular/core';

@Component({
  selector: 'atb-button',
  templateUrl: './atb-button.component.html',
  styleUrls: ['./atb-button.component.scss']
})
export class AtbButtonComponent implements OnInit {
  @Input('disabled') disabled: boolean = false;
  @Input('type') type: string = "fill";
  @Input('color') color: string = "default";

  constructor() { }

  ngOnInit() {

  }

}
