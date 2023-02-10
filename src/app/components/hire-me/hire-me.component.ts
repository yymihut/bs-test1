import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  NgForm,
  NgSelectOption,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { ConfirmationModalComponent } from 'src/app/shared/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-hire-me',
  templateUrl: './hire-me.component.html',
  styleUrls: ['./hire-me.component.css'],
})
export class HireMeComponent implements OnInit {
  constructor(private ruta: Router) {}

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
    // valuechanges and status - aflam date despre form in timp real
    // this.dateForm.valueChanges.subscribe((value) => console.log(value));
    // this.dateForm.statusChanges.subscribe((status) => console.log(status));
  }
  get arrayHobyes() {
    return <FormArray>this.dateForm.get('hobbyes');
  }
  onSubmit() {
    console.log(this.dateForm);
    this.dateForm.reset();
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

  // varianta de form cu template
  /*
  // abordarea cu ViewChild, se face pt a avea acces la form inainte de a da submit
  @ViewChild('f')
  dateForm!: NgForm;
  sex = ['barbat', 'femeie'];
  //trimis = false;

  user = {
    subiect: '',
    email: '',
    sex: '',
    mesaj: '',
    data: '',
  };

  onSubmit() {
    //dupa ce se trimite info la server, se navigheaza la pagina principala
    // this.ruta.navigate(['/']);
    console.log(this.dateForm);
    this.openConfirmareModal();
    this.user.subiect = this.dateForm.value.dateleUserului.selectia;
    this.user.email = this.dateForm.value.dateleUserului.email;
    this.user.sex = this.dateForm.value.dateleUserului.sexul;
    this.user.mesaj = this.dateForm.value.dateleUserului.mesaj;
    this.user.data = this.dateForm.value.dateleUserului.data;
  }
  */
}
