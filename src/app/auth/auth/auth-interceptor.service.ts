import {
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, take, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}
  // intercept HttpInterceptor executa cod inainte de a trimite http request
  //take(1) - ia o singura data valoarea apoi face unsubscribe
  // exhaustMap()  -asteapta ca primul observable sa fie complete apoi trece la urmatorul
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    //console.log('requestul este pe drum');
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        if(!user){
          return next.handle(req);
        }
        const modifiedRequest = req.clone({params: new HttpParams().set('auth', user.token)})
        //'auth'
        return next.handle(modifiedRequest);
      })
    );
  }
}