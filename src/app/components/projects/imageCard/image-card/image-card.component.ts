import { Component, Input, ViewChild } from '@angular/core';
import { Image } from 'src/app/services/image.model';
import { ConfirmationModalComponent } from 'src/app/shared/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-image-card',
  templateUrl: './image-card.component.html',
  styleUrls: ['./image-card.component.css'],
})
export class ImageCardComponent {
  @Input() image: Image = new Image(
    Math.floor(Math.random() * 6 + 1),
    '',
    '',
    ''
  );
  @ViewChild('confirmationModal')
  private modalComponent!: ConfirmationModalComponent;
  modalStyle: string = 'modal-style-primary';
  modalTitle: string = 'Info Confirmation';
  modalBody: string = 'This is a Information Confirmation message';
  modalButtonColor: string = 'btn-primary';
  async openModal() {
    return await this.modalComponent.open();
  }

  getConfirmationValue(value: any) {
    if (value == 'Save click') {
      console.log(value);
    }
  }

  ngOnInit(): void {}
}
