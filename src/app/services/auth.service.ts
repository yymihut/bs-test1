import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, catchError, Subject, tap, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
// install firebase -> ng add @angular/fire
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Database, set, ref, update } from '@angular/fire/database';

@Injectable({ providedIn: 'root' }) //{ providedIn: 'root' } - daca facem asta nu mai trebuie trecut serviciul in app.module.ts
export class AuthService {
  // user = new Subject<User>(); //primim datele noi de fiecare data cand ele se schimba
  user = new BehaviorSubject<User>(null); //ne da acces si la datele emise anterior
  userData: any; // Save logged in user data

  popup = new Subject<any>();

  constructor(
    //public angularFirestore: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning

    public database: Database
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        this.sendPopup(true, error.message);
      });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider()).then((res: any) => {
      this.router.navigate(['dashboard']);
    });
  }

  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.router.navigate(['dashboard']);

        this.SetUserData(result.user);
      })
      .catch((error) => {
        this.sendPopup(true, error.message);
      });
  }

  // Sign up with email/password
  onSignUp(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        this.SendVerificationMail();
        this.SetUserData(result.user);
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      })
      .catch((error) => {
        this.sendPopup(true, error.message);
      });
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email-address']);
      });
  }

  // Sign in with email/password
  logIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        if (result.user.emailVerified) {
          this.isLogged(result.user);
          this.handleAuthentication(
            result.user.uid,
            result.user.email,
            result.user.displayName,
            result.user.photoURL,
            result.user.emailVerified
          );
          this.afAuth.authState.subscribe((user) => {
            if (user) {
              console.log('la auth get isslogedin:*****:', result.user.emailVerified);
              this.router.navigate(['/']);
            }
          });
        } else {
          //console.log('la auth get isslogedin:*****:', this.isLoggedIn);
           this.router.navigate(['verify-email-address']);
        }
      })
      .catch((error) => {
        this.sendPopup(true, error);
        //window.alert(error.message);
      });
  }

  sendPopup(show, message) {
    return this.popup.next({show, message})
  }

  isLogged(user) {
    localStorage.setItem('user', JSON.stringify(user));
    JSON.parse(localStorage.getItem('user')!);
  }

  // Sign out
  logOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/']);
    });
  }

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    this.isLogged(userData);

    // console.log('SetUserData, userData', userData);
    // console.log(
    //   'SetUserData, localstorage',
    //   JSON.parse(localStorage.getItem('user')!)
    // );
    return set(ref(this.database, 'users/' + user.uid), {
      userData,
    });
  }

  private handleAuthentication(
    uid: string,
    email: string,
    displayName: string,
    photoURL: string,
    emailVerified: boolean
  ) {
    const user = new User(uid, email, displayName, photoURL, emailVerified);
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
