import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'assignment';
  isUserLoggedIn: boolean = false;
  constructor(private router: Router) {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.isUserLoggedIn = true;
      this.router.navigateByUrl('/dashboard');
    } else this.router.navigateByUrl('/login');
  }
}
