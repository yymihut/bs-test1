import { Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { map } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostService {
  fetchedPosts = new Subject<any>();

  constructor(private http: HttpClient) {}

  createPost(nume, amount, subiect, email, sex, data, hobbyes) {
    //send Http request
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
      .subscribe((responseData) => {
        //console.log(responseData);
      });
  }

  fetchPosts() {
    //send Http request
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
          // console.log('la post service:', posts);
          this.fetchedPosts.next(posts);
        },
        error: (err) => {
          console.log(err.message);
        },
      });
  }

  deletePost(id) {
    //send Http request
    //console.log('deletePost(id)', id);
    return this.http.delete(
      `https://lgg6-361fc.firebaseio.com/posts/${id}.json`
    ); //ca sa fim informati in comopent despre stergere
  }
}
