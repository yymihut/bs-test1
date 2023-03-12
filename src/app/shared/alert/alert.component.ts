import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],

})
export class AlertComponent {
   @Input() message: string;
}
