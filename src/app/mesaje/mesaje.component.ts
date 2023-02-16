import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../services/http.service';
import { Subscription } from 'rxjs';

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

  constructor(private postservice: PostService) {
    this.isFetching = true; // este pt load indicator, spiner
    this.postservice.fetchPosts();
    this.subscription = this.postservice.eroarea.subscribe((err) => {
      //console.log(err.message);
      this.error = err;
    });
  }

  ngOnInit() {
    //load posts cand se deschide pagina mesaje
    this.onFetchPosts();
  }

  onFetchPosts() {
    //send Http request
    this.subscription = this.postservice.fetchedPosts.subscribe({
      next: (posts) => {
        this.loadedPosts = posts;
        this.isFetching = false;
        //console.log('mesaje:', this.loadedPosts);
      },
    });
  }

  onDelete(id) {
    //send Http request for deletion
    this.postservice.deletePost(id).subscribe();
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
