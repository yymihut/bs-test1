import { Component, Injectable, Input } from '@angular/core';

@Component({
  selector: 'app-popup-alert',
  templateUrl: './popup-alert.component.html',
  styleUrls: ['./popup-alert.component.css']
})

@Injectable()
export class PopupAlertComponent {

  @Input() mesaj: any;


}
