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

  constructor(private postservice: PostService , private authService: AuthService,) {
    this.isFetching = true; // este pt load indicator, spiner

   this.subscription = this.postservice.eroarea.subscribe((err) => {
      console.log(err.message);
     this.error = err;
   });
  }

  async ngOnInit() {
    //load posts cand se deschide pagina mesaje
    //console.log('la post mesaje  this.authService.userData.uid ', this.authService.userData.uid);
    await this.onFetchPosts();
  }

 async onFetchPosts() {
    //send Http request

    await this.postservice.fetchPosts();
    if(this.loadedPosts){
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
        console.log('neededArray', this.loadedPosts);
        this.isFetching = false;
      },
    });
    }

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
