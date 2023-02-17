import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

interface AuthResponseData {
  //Response Payload - documentatia firebase: https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' }) //{ providedIn: 'root' } - daca facem asta nu mai trebuie trecut serviciul in app.module.ts
export class AuthService {
  constructor(private http: HttpClient) {}

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>( //declaram pt tipescript ce fel de format de data o sa primim
      //punem return sa putem da subscribe in component
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBJ8fRQ7uJ05LRwHbUWF1e52_slV4thHyI`,
      {
        email: email,
        password: password,
        returnSecureToken: true,
      }
    );
  }

  logIn(email: string, password: string) {
    return this.http // punem return ca sa putem face subscribe la acest serviciu
      .post<AuthResponseData>( //declaram pt tipescript ce fel de format de data o sa primim
        //punem return sa putem da subscribe in component
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBJ8fRQ7uJ05LRwHbUWF1e52_slV4thHyI`,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError((err) => {
          let errorMesage = 'A intervenit o eroare';
          if (!err.error || !err.error.error) {
            return throwError(() => new Error(errorMesage));
          }
          switch (err.error.error.message) {
            case 'EMAIL_NOT_FOUND':
              errorMesage = 'Introduceti un email corect !';
              // this.isLoading = false;
              break;
            case 'INVALID_PASSWORD':
              errorMesage = 'Parola incorecta !';
              console.log('case INVALID_PASSWORD:', errorMesage);
              // this.isLoading = false;
              break;
            default:
              break;
          }
          return throwError(() => new Error(errorMesage));
        })
      );
  }
}
