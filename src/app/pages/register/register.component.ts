import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../core/services/user.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  loading = false;
  submitted = false;
  userForm: FormGroup | any;
  errorAlert: string = 'This field is required';

  constructor(
    private router: Router,
    private _fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _userService: UserService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    const emailregex: RegExp =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.userForm = this._fb.group({
      name: ['', Validators.required],
      email: [
        '',
        [Validators.required, Validators.email, Validators.pattern(emailregex)],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.userForm.controls;
  }

  getErrorEmail() {
    return this.userForm.get('email').hasError('required')
      ? 'This field is required'
      : this.userForm.get('email').hasError('pattern')
      ? 'Not a valid email address'
      : '';
  }

  getErrorPassword() {
    return this.userForm.get('password').hasError('required')
      ? 'This field is required'
      : this.userForm.get('password').hasError('minlength')
      ? 'Password must be at least 6 characters long'
      : '';
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    }
    this.loading = true;
    this._userService
      .registerUser(this.userForm.value)
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.openSnackBar(data.message, 'success');
          this.router.navigate(['/']);
        },
        (error: any) => {
          this.loading = false;
          console.log(error)
          if (error.status === 409) {
            this.openSnackBar(error.message, 'error');
          } else {
            this.openSnackBar(error.message, 'error');
          }
        }
      );
  }
}
