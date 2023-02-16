import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' }) //{ providedIn: 'root' } - daca facem asta nu mai trebuie trecut serviciul in app.module.ts
export class PostService {
  fetchedPosts = new Subject<any>();
  eroarea = new Subject<any>();

  constructor(private http: HttpClient) {}

  createPost(nume, amount, subiect, email, sex, data, hobbyes) {
    //send Http request - folosit in  hire-me component
    const postData: Post = {
      nume: nume,
      amount: amount,
      subiect: subiect,
      email: email,
      sex: sex,
      data: data,
      hobbyes: hobbyes,
    };
    this.http
      .post('https://lgg6-361fc.firebaseio.com/posts.json', postData)
      .subscribe({
        next: (responseData) => {
          console.log(responseData);
        },
        error: (err) => {
          this.eroarea.next(err);
        },
      });
  }

  fetchPosts() {
    //send Http request  - folosit in  mesaje component
    this.http
      .get<{ [key: string]: Post }>(
        'https://lgg6-361fc.firebaseio.com/posts.json'
      )
      // ': {[key: string]: Post}' - se declara ce fel de type este responseData, este de tip post
      .pipe(
        map((responseData) => {
          const postArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postArray.push({ ...responseData[key], id: key });
            }
          }
          return postArray;
        })
      )
      .subscribe({
        next: (posts) => {
          this.fetchedPosts.next(posts);
        },
        error: (err) => {
          this.eroarea.next(err);
        },
      });
  }

  deletePost(id) {
    //send Http request- folosit in  mesaje component
    //console.log('deletePost(id)', id);
    return this.http.delete(
      `https://lgg6-361fc.firebaseio.com/posts/${id}.json`
    ); //ca sa fim informati in component despre stergere
  }
}
