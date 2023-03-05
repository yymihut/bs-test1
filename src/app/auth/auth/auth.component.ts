import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { PostService } from 'src/app/services/postService.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
  // @Input() showPopup: boolean = false;
  isLoading = false;
  isLoginMode = true;
  dateForm!: FormGroup;
  errLogin = null;
  subscription: Subscription;

  show = false;
  message1 = '';
  message2 = '';

  constructor(
    private ruta: Router,
    public authService: AuthService,
    public postService: PostService
  ) {}

  ngOnInit(): void {
    this.dateForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
    });
    //console.log('this.subscription la auth NEXT',);
  }

  onSubmit() {
    //console.log(this.dateForm);  *********varianta 1***********
    if (!this.dateForm.valid) {
      return;
    }
    this.subscription = this.authService.popup.subscribe((e) => {
      this.message1 = e.message1;
      this.message2 = e.message2;
      this.show = e.show;
      //console.log('this.authService.message555555qqqqqqq',e)
    });

    const email = this.dateForm.get('email').value;
    const password = this.dateForm.get('password').value;

    if (!this.isLoginMode) {
      this.isLoading = false;
      this.authService.onSignUp(email, password);
      this.isLoginMode = true;
    } else {
      this.isLoading = false;
      this.authService.logIn(email, password);
    }
    this.dateForm.reset();
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
    //this.postService.showPopup = false;
    // unsubscribe to ensure no memory leaks
    //this.subscription.unsubscribe();
  }
}

//console.log(this.dateForm);  *********varianta 2 - cu observable***********
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
