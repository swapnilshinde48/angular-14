import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isUserLoggedIn: boolean = false;
  constructor(private router: Router) {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.isUserLoggedIn = true;
    } else this.router.navigateByUrl('/login');
  }

  ngOnInit() {}
  logOut() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
    location.reload();
  }
}
