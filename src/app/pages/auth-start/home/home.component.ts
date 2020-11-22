import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/single-services/auth-service/auth.service';
import { UserModel } from '../../../models/UserModel';
import { UserService } from '../../../services/single-services/user-service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  users: UserModel[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.fetchUsers();
  }

  public logout() {
    this.authService.logout();
  }

  public fetchUsers() {
    this.userService.getUsers().subscribe(users => {
      console.log(users);

      this.users = users;
    });
  }

  public goToATable() {
    this.router.navigateByUrl("/auth/atable");
  }

  public goToTeamsUpdate() {
    this.router.navigateByUrl("/auth/team-update");
  }

  public goToTeamSelect() {
    this.router.navigateByUrl("/auth/team-select");
  }

}
