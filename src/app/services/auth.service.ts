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
  error = ''
  popup = new Subject<any>();
  private timer: any;

  constructor(
    //public angularFirestore: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,

    public database: Database
  ) {

  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        this.sendPopup(true, error.message, null);
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
      this.router.navigate(['/']);
    });
  }

  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.router.navigate(['dashboard']);

        // this.SetUserData(result.user);
      })
      .catch((error) => {
        this.sendPopup(true, error.message, null);
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
        set(ref(this.database, 'users/' + result.user.uid), { result });
        localStorage.setItem('user', 'null');
      })
      .catch((error) => {
        this.sendPopup(true, error.message, null);
      });
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.sendPopup(true, 'Email trimis !', null);
      });
  }

  // Sign in with email/password
  logIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log('la auth logIn(:', result.user.emailVerified);
        if (result.user.emailVerified) {
          this.isLogged(result.user);
          this.handleAuthentication(
            result.user.uid,
            result.user.email,
            result.user.displayName,
            result.user.photoURL,
            result.user.emailVerified
          );
          this.autoLogout();
          this.router.navigate(['/']);
        } else {
          this.sendPopup(
            true,
            `Email neverificat, apasati pe linkul trimis la adresa ${result.user.email}`,
            'Retrimite mail'
          );
        }
      })
      .catch((error) => {
        console.log('la auth .catch((error) =>', error.message);
        this.error = error.message;
        this.sendPopup(true, error, null);
      });
  }

  sendPopup(show, message1, message2) {
    return this.popup.next({ show, message1, message2 });
  }

  isLogged(user) {
    localStorage.setItem('user', JSON.stringify(user));
    JSON.parse(localStorage.getItem('user')!);
    return true;
  }

  // Sign out
  logOut() {
    this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.user.next(null);
      this.router.navigate(['/']);
      if (this.timer) {
        clearTimeout(this.timer);
      }
    });
  }

  //auto  login - daca avem user logat in local storage
  autoLogin() {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      return;
    }
    const loadedUser = new User(
      user.uid,
      user.email,
      user.displayName,
      user.photoURL,
      user.emailVerified
    );
    this.user.next(loadedUser);
    this.autoLogout();
    //console.log('la auth autoLogin() {loadedUser', loadedUser);
  }

  autoLogout() {
    this.timer = setTimeout(() => {
      this.logOut();
    }, 18000);
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
    //console.log('la auth private handleAuthentication(', this.user);
    //localStorage.setItem('user', JSON.stringify(this.user));
    localStorage.setItem('user', JSON.stringify(user));
    //const userv = JSON.parse(localStorage.getItem('user'));
    //console.log('la auth local storage:', userv);
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
