import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { PostService } from 'src/app/services/postService.service';
import { AuthService } from '../../services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertComponent } from 'src/app/shared/alert/alert.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
  // @Input() showPopup: boolean = false;
  isLoading = false;
  isLoginMode = true;
  dateForm!: FormGroup;
  errLogin = null;
  subscription: Subscription;

  show = false;
  message1 = '';
  message2 = '';

  constructor(
    private ruta: Router,
    public authService: AuthService,
    public postService: PostService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.dateForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
    });
    //console.log('la auth component inainte de if', this.authService.error);
  }

  showErrorModal() {
    console.log('la auth component show modal', this.authService.error);
    const modalRef = this.modalService.open(AlertComponent);
    modalRef.componentInstance.title = 'Error';
    modalRef.componentInstance.message = this.message1;
  }

  onSubmit() {
    //console.log(this.dateForm);  *********varianta 1***********
    if (!this.dateForm.valid) {
      return;
    }
    this.subscription = this.authService.popup.subscribe((e) => {
      this.message1 = e.message1;
      this.message2 = e.message2;
      this.show = e.show;

      this.showErrorModal();
      this.subscription.unsubscribe();
      //console.log('this.authService.message555555qqqqqqq',e)
    });

    const email = this.dateForm.get('email').value;
    const password = this.dateForm.get('password').value;

    if (!this.isLoginMode) {
      this.isLoading = false;
      this.authService.onSignUp(email, password);
      this.isLoginMode = true;
    } else {
      this.isLoading = false;
      this.authService.logIn(email, password);
    }
    this.dateForm.reset();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.dateForm.reset();
    //this.errLogin = null;
  }

  onCancel() {
    this.ruta.navigate(['/']);
  }

  ngOnDestroy() {
    // this.postService.showPopup = false
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}

//console.log(this.dateForm);  *********varianta 2 - cu observable***********
// let authObs: Observable<AuthResponseData>;

// if (!this.dateForm.valid) {
//   return;
// }

// const email = this.dateForm.get('email').value;
// const password = this.dateForm.get('password').value;

// this.isLoading = true;
// if (this.isLoginMode) {
//   authObs = this.authService.logIn(email, password);
// } else {
//   authObs = this.authService.signUp(email, password);
// }

// authObs.subscribe({
//   next: (responseData) => {
//     //console.log('responseData',responseData);
//     this.isLoading = false;
//     this.ruta.navigate(['/mesaje']);
//   },
//   error: (err) => {
//     //console.log('responseData error',err);
//     this.isLoading = false;
//     this.errLogin = err;
//   },
// });

// this.dateForm.reset();
