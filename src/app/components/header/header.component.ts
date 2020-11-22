import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  menuOpen: boolean = false;
  appUrl = location.origin;


  constructor() { }

  ngOnInit() {

  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
