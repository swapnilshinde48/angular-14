import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../app/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'assignment';
  isUserLoggedIn: boolean = false;
  constructor(private router: Router, private authService: AuthService) {}
  ngOnInit(): void {
    if (!localStorage.getItem('hello')) {
      this.authService.initAuth();
      this.authService.login();
    }
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.isUserLoggedIn = true;
      this.router.navigateByUrl('/dashboard');
    } else this.router.navigateByUrl('/login');
  }
}
