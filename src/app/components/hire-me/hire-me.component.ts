import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Post } from 'src/app/services/post.model';
import { PostService } from 'src/app/services/postService.service';
import { ConfirmationModalComponent } from 'src/app/shared/confirmation-modal/confirmation-modal.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hire-me',
  templateUrl: './hire-me.component.html',
  styleUrls: ['./hire-me.component.css'],
})
export class HireMeComponent implements OnInit, OnDestroy {
  loadedPosts = [];
  error = null;
  subscription: Subscription;

  constructor(private ruta: Router, private postService: PostService) {}

  @ViewChild('confirmationModal')
  private modalComponent!: ConfirmationModalComponent;
  modalStyle: string = 'modal-style-primary';
  modalTitle: string = 'Info Confirmation';
  modalBody: string = 'This is a Information Confirmation message';
  modalButtonColor: string = 'btn-primary';

  async openConfirmareModal() {
    return await this.modalComponent.open();
  }

  sex = ['femeie', 'barbat'];
  dateForm!: FormGroup;
  numeInterzise: string[] = ['Ioan', 'Maria']; // le folosim sa creeam un validator custom

  ngOnInit(): void {
    this.dateForm = new FormGroup({
      nume: new FormControl(null, [
        Validators.required,
        this.Interzise.bind(this),
      ]),
      amount: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/),
      ]),
      subiect: new FormControl(null, Validators.required),
      email: new FormControl(
        null,
        [Validators.required, Validators.email],
        this.emailInterzis
      ),
      sex: new FormControl('male'),
      mesaj: new FormControl(null, Validators.required),
      data: new FormControl(null, Validators.required),
      hobbyes: new FormArray([]),
    });
    this.subscription = this.postService.message.subscribe((err) => {
      console.log(err.message);
      this.error = err;
    });
    // valuechanges and status - aflam date despre form in timp real
    // this.dateForm.valueChanges.subscribe((value) => console.log(value));
    // this.dateForm.statusChanges.subscribe((status) => console.log(status));
  }
  get arrayHobyes() {
    return <FormArray>this.dateForm.get('hobbyes');
  }
  resetare() {
    this.onCreatePost({
      nume: this.dateForm.get('nume').value,
      amount: this.dateForm.get('amount').value,
      subiect: this.dateForm.get('subiect').value,
      email: this.dateForm.get('email').value,
      sex: this.dateForm.get('sex').value,
      data: this.dateForm.get('data').value,
      hobbyes: this.dateForm.get('hobbyes').value,
    });
    this.dateForm.reset();
    // this.ruta.navigate(['/']);
  }

  onCancel() {
    this.ruta.navigate(['/']);
  }
  onSubmit() {
    //console.log(this.dateForm);
    //console.log('dateForm.get(email):', this.dateForm.get('email').value);
    this.openConfirmareModal();
  }
  onAddHobby() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.dateForm.get('hobbyes')).push(control);
  }

  // un validator pt numele interzise din array,  este o functie:
  Interzise(control: FormControl) {
    if (this.numeInterzise.indexOf(control.value) !== -1) {
      return { 'numele-este-interzis': true }; //eroarea care se trece la obiectul erori
    }
    return null;
  }
  //atunci cand aducem de la server, trebuie async promise validator
  emailInterzis(control: FormControl) {
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'test@test.com') {
          resolve({ 'emailul-este-interzis': true });
        } else {
          resolve(null);
        }
      }, 1500);
    });
    return promise;
  }

  onCreatePost(postData: Post) {
    //send Http request prin serviciul http
    this.postService.createPost(
      postData.nume,
      postData.amount,
      postData.subiect,
      postData.email,
      postData.sex,
      postData.data,
      postData.hobbyes
    );
  }
  inchideEroarea() {
    this.error = null;
    this.ruta.navigate(['/auth']);
  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}
