import {
  Component,
  OnDestroy,
  OnInit,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  title = 'instant-search';
  public searchInput: string;
  private userSubs: Subscription;
  esteLogat = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.userSubs = this.authService.user.subscribe((user) => {
      this.esteLogat = !user ? false : true;
    });
    //console.log('nav bar', this.authService.isLoggedIn);
  }

  logOut() {
    this.authService.logOut();
    this.esteLogat = false;
  }

  ngOnDestroy(): void {
    this.userSubs.unsubscribe();
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }
}
