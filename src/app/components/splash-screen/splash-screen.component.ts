import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations'

@Component({
  selector: 'splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
  animations: [
    trigger('loadingChanged', [
      state('shown', style({ opacity: 1, display: 'flex' })),
      state('hidden', style({ opacity: 0, display: 'none'})),
      transition('shown => hidden', animate('600ms')),
      transition('hidden => shown', animate('300ms')),
    ])
  ]
})
export class SplashScreenComponent implements OnInit {
  @Input('loading') loading: boolean = true;

  @HostBinding('@loadingChanged') get loadingChanged() {
    return this.loading ? "shown" : "hidden";
  }
  constructor() { }

  ngOnInit() {
  }

}
