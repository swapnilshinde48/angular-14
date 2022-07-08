import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  tmpUserName = 'r@gmail.com';
  tmpPassword = '123';
  profileForm = {} as FormGroup;
  submitted = false;
  invalidPassword = false;
  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.profileForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      Password: ['', [Validators.required]],
    });
  }
  get loginFormControl() {
    return this.profileForm.controls;
  }
  ngOnInit() {}
  onSubmit() {
    this.submitted = true;
    if (this.profileForm.valid) {
      if (
        this.profileForm.controls.username.value == this.tmpUserName &&
        this.profileForm.controls.Password.value == this.tmpPassword
      ) {
        this.invalidPassword = false;
        this.router.navigateByUrl('/dashboard');
        localStorage.setItem('isLoggedIn', 'true');
        location.reload();
      } else this.invalidPassword = true;
    }
  }
}
