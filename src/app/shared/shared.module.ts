import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { LoadingspinnerComponent } from './loadingspinner/loadingspinner.component';
import { PopupAlertComponent } from './popup-alert/popup-alert.component';

@NgModule({
  declarations: [ConfirmationModalComponent, LoadingspinnerComponent, PopupAlertComponent],
  imports: [CommonModule, RouterModule.forChild([])],
  exports: [ConfirmationModalComponent, LoadingspinnerComponent,PopupAlertComponent],
})
export class SharedModule {}
