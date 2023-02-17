import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { LoadingspinnerComponent } from './loadingspinner/loadingspinner.component';

@NgModule({
  declarations: [ConfirmationModalComponent, LoadingspinnerComponent],
  imports: [CommonModule, RouterModule.forChild([])],
  exports: [ConfirmationModalComponent, LoadingspinnerComponent],
})
export class SharedModule {}
