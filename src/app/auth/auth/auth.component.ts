import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  dateForm!: FormGroup;

  constructor(private ruta: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.dateForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
    });
    // valuechanges and status - aflam date despre form in timp real
    // this.dateForm.valueChanges.subscribe((value) => console.log(value));
    // this.dateForm.statusChanges.subscribe((status) => console.log(status));
  }

  onSubmit() {
    console.log(this.dateForm);
    if (!this.dateForm.valid) {
      return;
    }
    const email = this.dateForm.get('email').value;
    const password = this.dateForm.get('password').value;
    if (this.isLoginMode) {
      //....
    } else {
      this.authService.signup(email, password).subscribe({
        next: (responseData) => {
          console.log(responseData);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
    this.dateForm.reset();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onCancel() {
    this.ruta.navigate(['/']);
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    //this.subscription.unsubscribe();
  }
}
