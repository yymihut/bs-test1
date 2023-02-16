import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface AuthResponseData {
  //Response Payload - documentatia firebase: https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({ providedIn: 'root' }) //{ providedIn: 'root' } - daca facem asta nu mai trebuie trecut serviciul in app.module.ts
export class AuthService {
  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
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
}
