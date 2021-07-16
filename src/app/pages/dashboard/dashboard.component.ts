import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isLoading = true;
  currentUser: any;

  constructor(
    private router: Router,
    private _authService: AuthService,
    private _userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUserMe();
  }

  loadUserMe() {
    this._userService.userMe().subscribe(
      (data: any) => {
        console.log('users=>>', data);
        this.isLoading = false;
        this.currentUser = data.response;
      },
      (error: any) => {
        this.isLoading = false;
        console.log('error=>>', error);
      }
    );
  }

  onLoggedOut() {
    this._authService.logout();
    this.router.navigate(['/login']);
  }
}
