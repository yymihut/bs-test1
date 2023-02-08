import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';

@NgModule({
  declarations: [ConfirmationModalComponent],
  imports: [CommonModule, RouterModule.forChild([])],
  exports: [ConfirmationModalComponent],
})
export class SharedModule {}
