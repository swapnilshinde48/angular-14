import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  username: string = 'raju@gmail.com';
  password: string = '1234';
  usernotloggedin: boolean = false;
  profileForm = new FormGroup({
    username: new FormControl(''),
    Password: new FormControl(''),
  });
  constructor() {}

  ngOnInit(): void {}
  login() {
    console.log(this.profileForm.value);
    if (
      (this.profileForm.value.username == this.username &&
        this.profileForm.value.Password) == this.password
    ) {
      this.usernotloggedin = false;
      console.log('Logged in successfully');
    } else this.usernotloggedin = true;
  }
}
