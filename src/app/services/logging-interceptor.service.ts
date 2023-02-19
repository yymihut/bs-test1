import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { tap } from 'rxjs';

export class LoggingInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    //console.log('requestul logging este pe drum');
    return next.handle(req).pipe(
      tap((event) => {
        //console.log('eq).pipe(tap(event', event);
      })
    );
  }
}
