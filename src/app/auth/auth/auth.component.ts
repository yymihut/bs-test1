import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoading = false;
  isLoginMode = true;
  dateForm!: FormGroup;
  errLogin = null;

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
    //console.log(this.dateForm);  *********varianta 1***********
    if (!this.dateForm.valid) {
      return;
    }
    const email = this.dateForm.get('email').value;
    const password = this.dateForm.get('password').value;

    if (!this.isLoginMode) {
      this.isLoading = false;
      this.authService.onSignUp(email, password);
      this.isLoginMode = true;
    } else {
      this.isLoading = false;
      this.authService.onSignIn(email, password);
    }

    this.dateForm.reset();
    //console.log(this.dateForm);  *********varianta 2***********
    // let authObs: Observable<AuthResponseData>;

    // if (!this.dateForm.valid) {
    //   return;
    // }

    // const email = this.dateForm.get('email').value;
    // const password = this.dateForm.get('password').value;

    // this.isLoading = true;
    // if (this.isLoginMode) {
    //   authObs = this.authService.logIn(email, password);
    // } else {
    //   authObs = this.authService.signUp(email, password);
    // }

    // authObs.subscribe({
    //   next: (responseData) => {
    //     //console.log('responseData',responseData);
    //     this.isLoading = false;
    //     this.ruta.navigate(['/mesaje']);
    //   },
    //   error: (err) => {
    //     //console.log('responseData error',err);
    //     this.isLoading = false;
    //     this.errLogin = err;
    //   },
    // });

    // this.dateForm.reset();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.dateForm.reset();
    this.errLogin = null;
  }

  onCancel() {
    this.ruta.navigate(['/']);
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    //this.subscription.unsubscribe();
  }
}
