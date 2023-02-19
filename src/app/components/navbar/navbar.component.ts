import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy{
  title = 'instant-search';
  public searchInput: string;
  private userSubs : Subscription;
  esteLogat = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userSubs = this.authService.user.subscribe(user=>{
        this.esteLogat = !user ? false : true;
    });
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  ngOnDestroy(): void {
    this.userSubs.unsubscribe()
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

  }
}
