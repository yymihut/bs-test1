import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

//import 'firebaseui/dist/firebaseui.css';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { User } from './user.model';

const firebaseConfig = {
  apiKey: 'AIzaSyBJ8fRQ7uJ05LRwHbUWF1e52_slV4thHyI',
  authDomain: 'lgg6-361fc.firebaseapp.com',
  databaseURL: 'https://lgg6-361fc.firebaseio.com',
  projectId: 'lgg6-361fc',
  storageBucket: 'lgg6-361fc.appspot.com',
  messagingSenderId: '737254172140',
  appId: '1:737254172140:web:ddae032ac5b7587bcf8cc9',
  measurementId: 'G-0NH9DECZE5',
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export interface AuthResponseData2 {
  //Response Payload - documentatia firebase: https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
  displayName: string;
}

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
  user = new BehaviorSubject<User>(null); //ne da acces si la datele emise anterior

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
    const auth = getAuth();

    if (!this.isLoginMode) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          this.isLoading = false;
          console.log('la login in am primit :', user);
          console.log('la login auth :', auth);
          //this.ruta.navigate(['/mesaje']);
          // ...
        })
        .catch((error) => {
          const errorMessage = error.message;
          this.isLoading = false;
          this.errLogin = errorMessage;
          // ..
        });
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          //console.log('la sign in am primit :', user);
          console.log('la sign auth :', auth.currentUser.getIdToken());
          this.isLoading = false;
          // ...
        })
        .catch((error) => {
          const errorMessage = error.message;
          this.isLoading = false;
          this.errLogin = errorMessage;
        });
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

  private handleAuthentication(
    email: string,
    localId: string,
    accessToken: string,
    expiresIn: number,
    displayName: string
  ) {
    const expirationDate = new Date(
      new Date().getTime() + +expiresIn * 1000
      //new Date().getTime() - timpul de la inceputul anului 1970 + timpul de expirare de la firebase
    );
    const user = new User(
      email,
      localId,
      accessToken,
      expirationDate,
      displayName
    );
    this.user.next(user);
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
