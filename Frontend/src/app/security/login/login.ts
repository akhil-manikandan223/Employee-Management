import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../shared/material.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  form: FormGroup;
  hidePassword = signal(true);

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    this.router.navigate(['./dashboard']);
    if (this.form.valid) {
      this.router.navigate(['./dashboard']);
      console.log('Login submitted:', this.form.value);
    }
  }

  onGoogleSignIn(): void {
    console.log('Google Sign-In clicked');
  }

  onForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  goToRegisterUser() {
    this.router.navigate(['/register']);
  }
}
