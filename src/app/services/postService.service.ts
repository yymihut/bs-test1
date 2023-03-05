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
  get,
  remove,
  getDatabase,
} from '@angular/fire/database';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' }) //{ providedIn: 'root' } - daca facem asta nu mai trebuie trecut serviciul in app.module.ts
export class PostService {
  fetchedPosts = new Subject<any>();
  message = new Subject<any>();
  isLogedIn = null;
  uid: string = '';

  constructor(
    private authService: AuthService,
    public database: Database,
    private ruta: Router
  ) {}

  createPost(nume, amount, subiect, email, sex, data, hobbyes) {
    this.uid = JSON.parse(localStorage.getItem('user')!).uid;
    //send request - folosit in  hire-me component
    if (this.authService.isLoggedIn) {
      //console.log('this.authService.isLoggedIn ', this.authService.isLoggedIn);
      const id = new Date().valueOf();
      //console.log('this.authService.userData.uid:', this.uid);
      set(ref(this.database, `users/${this.uid}/mesages/${id}`), {
        nume: nume,
        amount: amount,
        subiect: subiect,
        email: email,
        sex: sex,
        data: data,
        hobbyes: hobbyes,
        id: id,
      });
    } else {
      this.ruta.navigate(['auth']);
    }
  }

  fetchPosts() {
    this.uid = JSON.parse(localStorage.getItem('user')!).uid;
    const dbRef = ref(getDatabase());

    return get(child(dbRef, `users/${this.uid}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          this.fetchedPosts.next(snapshot.val());
        } else {
          this.message.next('Nu exista date de afisat !');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  deletePost(id) {
    this.uid = JSON.parse(localStorage.getItem('user')!).uid;
    const dbRef = ref(getDatabase());
    remove(child(dbRef, `users/${this.uid}/mesages/${id}`))
      .then((result) => {
        console.log('deletePost(id)', result);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
