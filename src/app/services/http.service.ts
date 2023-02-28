import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';

import {
  Database,
  set,
  ref,
  update,
  push,
  child,
} from '@angular/fire/database';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' }) //{ providedIn: 'root' } - daca facem asta nu mai trebuie trecut serviciul in app.module.ts
export class PostService {
  fetchedPosts = new Subject<any>();
  eroarea = new Subject<any>();
  isLogedIn = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    public database: Database,
    private ruta: Router
  ) {}

  createPost(nume, amount, subiect, email, sex, data, hobbyes) {
    //send Http request - folosit in  hire-me component
    if (this.authService.isLoggedIn) {
      console.log('this.authService.isLoggedIn ', this.authService.isLoggedIn);
      console.log('this.isLoggedIn()', this.authService.isLoggedIn);
      const id = new Date().valueOf();
      const postData = {
        nume: nume,
        amount: amount,
        subiect: subiect,
        email: email,
        sex: sex,
        data: data,
        hobbyes: hobbyes,
        id: id,
      };
      console.log(
        'this.authService.userData.uid:',
        this.authService.userData.uid
      );
      set(
        ref(
          this.database,
          `users/${this.authService.userData.uid}/mesages/${id}`
        ),
        {
          nume: nume,
          amount: amount,
          subiect: subiect,
          email: email,
          sex: sex,
          data: data,
          hobbyes: hobbyes,
          id: id,
        }
      );
    } else {
      console.log(
        'this.authService.isLoggedIn dupa else:',
        this.authService.isLoggedIn
      );
      this.ruta.navigate(['auth']);
    }
  }

  fetchPosts() {}

  deletePost(id) {
    //send Http request- folosit in  mesaje component
    console.log('deletePost(id)', id);
    return this.http.delete(
      `https://lgg6-361fc.firebaseio.com/posts/${id}.json`
    ); //ca sa fim informati in component despre stergere
  }
}
