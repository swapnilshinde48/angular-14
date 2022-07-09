import { Component, OnInit, Directive, ViewEncapsulation } from '@angular/core';
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
  emailRegEx = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.profileForm = this.formBuilder.group({
      username: [
        '',
        [Validators.required, Validators.pattern(this.emailRegEx)],
      ],
      Password: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  get loginFormControl() {
    return this.profileForm.controls;
  }

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
