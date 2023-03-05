import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../services/postService.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-mesaje',
  templateUrl: './mesaje.component.html',
  styleUrls: ['./mesaje.component.css'],
})
export class MesajeComponent implements OnInit, OnDestroy {
  loadedPosts = [];
  subscription: Subscription;
  isFetching = false; // este pt load indicator, spiner
  error = null;
  show = false;

  constructor(
    private postservice: PostService,
    private authService: AuthService
  ) {
    this.isFetching = true; // este pt load indicator, spiner
  }

  ngOnInit() {
    this.subscription = this.postservice.message.subscribe((err) => {
      this.error = err;
      this.show = true;
    });
    this.onFetchPosts();
  }

  onFetchPosts() {
    //send request using postservice
    this.postservice.fetchPosts();
    if (this.loadedPosts) {
      this.subscription = this.postservice.fetchedPosts.subscribe({
        next: (posts) => {
          for (const key in posts.mesages) {
            if (posts.mesages.hasOwnProperty(key)) {
              let array = Object.entries(posts.mesages[key]);
              const entries = new Map(array);
              const obj = Object.fromEntries(entries);
              this.loadedPosts.push(obj);
            }
          }
          this.isFetching = false;
        },
        error: (err) => {
          this.error = err;
        },
      });
    }
  }

  onDelete(id) {
    //send Http request for deletion
    this.postservice.deletePost(id);
    this.loadedPosts.splice(
      this.loadedPosts.findIndex(function (i) {
        return i.id === id;
      }),
      1
    );
  }

  inchideEroarea() {
    this.error = null;
    this.isFetching = false;
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}
