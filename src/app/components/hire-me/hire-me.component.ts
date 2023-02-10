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

  ngOnInit(): void {
    this.dateForm = new FormGroup({
      subiect: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      sex: new FormControl('male'),
      mesaj: new FormControl(null, Validators.required),
      data: new FormControl(null, Validators.required),
      hobbyes: new FormArray([]),
    });
  }
  onSubmit() {
    console.log(this.dateForm);
  }
  onAddHobby() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.dateForm.get('hobbies')).push(control);
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
