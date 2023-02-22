//nu folosesc fisierul auth.service ******

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Subject, tap, throwError } from 'rxjs';

import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

//import 'firebaseui/dist/firebaseui.css';
import {
  getAuth,
  onAuthStateChanged,
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

// export interface AuthResponseData {
//   //Response Payload - documentatia firebase: https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
//   idToken: string;
//   email: string;
//   refreshToken: string;
//   expiresIn: string;
//   localId: string;
//   registered?: boolean;
//   displayName: string;
// }

@Injectable({ providedIn: 'root' }) //{ providedIn: 'root' } - daca facem asta nu mai trebuie trecut serviciul in app.module.ts
export class AuthService {
  // user = new Subject<User>(); //primim datele noi de fiecare data cand ele se schimba
  user = new BehaviorSubject<User>(null); //ne da acces si la datele emise anterior

  constructor(private http: HttpClient) {}

  onSignUp(email, password) {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log('la login in am primit :', user);
        console.log('la login auth :', auth);
        //this.ruta.navigate(['/mesaje']);
        // ...
      })
      .catch((error) => {
        const errorMessage = error.message;
        // this.isLoading = false;
        // this.errLogin = errorMessage;
        // ..
      });
  }

  onSignIn(email, password) {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        //console.log('la sign in am primit :', user);
        console.log(
          'la sign userCredential.user :',
          user.uid,
          user.displayName,
          user.email,
          user
        );
        console.log('analytics', analytics);
        this.handleAuthentication(user.uid, user.email, user.displayName);
        // ...
      })
      .catch((error) => {
        const errorMessage = error.message;
        // this.isLoading = false;
        // this.errLogin = errorMessage;
      });
  }
  private handleAuthentication(
    uid: string,
    displayName: string,
    email: string
  ) {
    const user = new User(uid, email, displayName);
    this.user.next(user);
  }

  // signUp(email: string, password: string) {
  //   return this.http
  //     .post<AuthResponseData>( //declaram pt tipescript ce fel de format de data o sa primim
  //       //punem return sa putem da subscribe in component
  //       `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBJ8fRQ7uJ05LRwHbUWF1e52_slV4thHyI`,
  //       {
  //         email: email,
  //         password: password,
  //         returnSecureToken: true,
  //       }
  //     )
  //     .pipe(
  //       catchError(this.handleError),
  //       tap((respData) => {
  //         console.log('sign up, responseData', respData);
  //         this.handleAuthentication(
  //           respData.email,
  //           respData.localId,
  //           respData.idToken,
  //           +respData.expiresIn,
  //           respData.displayName
  //         );
  //       })
  //     ); //tap -ruleaza cod dupa ce se primeste raspunsul
  // }

  // logIn(email: string, password: string) {
  //   return this.http // punem return ca sa putem face subscribe la acest serviciu
  //     .post<AuthResponseData>( //declaram pt tipescript ce fel de format de data o sa primim
  //       //punem return sa putem da subscribe in component
  //       `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBJ8fRQ7uJ05LRwHbUWF1e52_slV4thHyI`,
  //       {
  //         email: email,
  //         password: password,
  //         returnSecureToken: true,
  //       }
  //     )
  //     .pipe(
  //       catchError(this.handleError),
  //       tap((respData) => {
  //         this.handleAuthentication(
  //           respData.email,
  //           respData.localId,
  //           respData.idToken,
  //           +respData.expiresIn,
  //           respData.displayName
  //         );
  //       })
  //     );
  // }

  // private handleAuthentication(
  //   email: string,
  //   localId: string,
  //   accessToken: string,
  //   expiresIn: number,
  //   displayName: string
  // ) {
  //   const expirationDate = new Date(
  //     new Date().getTime() + +expiresIn * 1000
  //     //new Date().getTime() - timpul de la inceputul anului 1970 + timpul de expirare de la firebase
  //   );
  //   const user = new User(
  //     email,
  //     localId,
  //     accessToken,
  //     expirationDate,
  //     displayName
  //   );
  //   this.user.next(user);
  // }

  // private handleError(err: HttpErrorResponse) {
  //   let errorMesage = 'A intervenit o eroare';
  //   if (!err.error || !err.error.error) {
  //     return throwError(() => new Error(errorMesage));
  //   }
  //   switch (err.error.error.message) {
  //     case 'EMAIL_NOT_FOUND':
  //       errorMesage = 'Introduceti un email corect !';
  //       break;
  //     case 'INVALID_PASSWORD':
  //       errorMesage = 'Parola incorecta !';
  //       //console.log('case INVALID_PASSWORD:', errorMesage);
  //       break;
  //     case 'EMAIL_EXISTS':
  //       errorMesage = 'Acest email exista !';
  //       break;
  //     case 'OPERATION_NOT_ALLOWED':
  //       errorMesage = 'Parola este dezactivata pt acest proiect !';
  //       break;
  //     case 'TOO_MANY_ATTEMPTS_TRY_LATER':
  //       errorMesage =
  //         'Prea multe incercari esuate, user blocat, incearca mai tarziu !';
  //       break;
  //     case 'USER_DISABLED':
  //       errorMesage = 'User blocat de administrator !';
  //       break;
  //     default:
  //       break;
  //   }
  //   return throwError(() => new Error(errorMesage));
  // }
}
