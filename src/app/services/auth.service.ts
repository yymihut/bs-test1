import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Subject, tap, throwError } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

// install firebase -> ng add @angular/fire

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { User } from '../auth/auth/user.model';
import { Router } from '@angular/router';

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
  token = null;
  uid = null;
  constructor(
    private http: HttpClient,
    private fireauth: AngularFireAuth,
    private router: Router
  ) {}

  forgotPassword(email) {
    this.fireauth.sendPasswordResetEmail(email).then(
      (responseData) => {
        console.log('la forgotPassword :', responseData);
      },
      (error) => {}
    );
  }

  logOut() {
    this.fireauth.signOut().then(
      (responseData) => {
        localStorage.removeItem('token');
        this.router.navigate(['/']);
        console.log('la logout :', responseData);
      },
      (error) => {}
    );
  }

  onSignUp(email, password) {
    this.fireauth.createUserWithEmailAndPassword(email, password).then(
      (responseData) => {
        console.log('la onSignUp :', responseData);
        this.sendEmailForVerification(responseData.user);
      },
      (error) => {}
    );
  }

  sendEmailForVerification(user: any) {
    user.sendEmailVerification().then(
      (responseData) => {
        console.log('la sendEmailForVerification :', responseData);
        this.router.navigate(['/verify-email']);
      },
      (error) => {}
    );
  }
  // onSignUp(email, password) {
  //   const auth = getAuth();
  //   createUserWithEmailAndPassword(auth, email, password)
  //     .then((userCredential) => {
  //       // Signed in
  //       const user = userCredential.user;
  //       console.log('la login in am primit :', user);
  //       console.log('la login auth :', auth);
  //       //this.ruta.navigate(['/mesaje']);
  //       // ...
  //     })
  //     .catch((error) => {
  //       const errorMessage = error.message;
  //       // this.isLoading = false;
  //       // this.errLogin = errorMessage;
  //       // ..
  //     });
  // }

  onSignIn(email, password) {
    this.fireauth.signInWithEmailAndPassword(email, password).then(
      (responseData) => {
        localStorage.setItem('token', 'true');
        if (responseData.user?.emailVerified == true) {
          console.log(
            'la onSignIn, emailul este verificat :',
            responseData.user.emailVerified,
            responseData.user.getIdToken().then((e) => {
              console.log('getIdToken:', e);
              this.token = e;
              this.uid = responseData.user.uid;
              this.handleAuthentication(
                this.token,
                responseData.user.uid,
                responseData.user.displayName,
                responseData.user.email
              );
            })
          );
        } else {
          console.log(
            'la onSignIn,emailul este verificat :',
            responseData.user.emailVerified
          );
        }
      },
      (error) => {}
    );
  }

  // onSignIn(email, password) {
  //   //****** mai jos metoda veche */
  //   const auth = getAuth();
  //   signInWithEmailAndPassword(auth, email, password)
  //     .then((userCredential) => {
  //       // Signed in
  //       const user = userCredential.user;
  //       //console.log('la sign in am primit :', user);
  //       console.log(
  //         'la sign userCredential.user :',
  //         user.uid,
  //         user.displayName,
  //         user.email,
  //         user
  //       );
  //       auth.currentUser.getIdToken().then((e) => {
  //         this.token = e;
  //         console.log('token analytics', user.uid);
  //         this.handleAuthentication(
  //           this.token,
  //           user.uid,
  //           user.email,
  //           user.displayName
  //         );
  //       });
  //       // ...
  //     })
  //     .catch((error) => {
  //       const errorMessage = error.message;
  //       // this.isLoading = false;
  //       // this.errLogin = errorMessage;
  //     });
  // }
  private handleAuthentication(
    token: string,
    uid: string,
    displayName: string,
    email: string
  ) {
    const user = new User(token, uid, email, displayName);
    this.user.next(user);
  }
  //********** vechea metoda mai jos */
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
