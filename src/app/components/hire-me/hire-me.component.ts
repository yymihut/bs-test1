import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hire-me',
  templateUrl: './hire-me.component.html',
  styleUrls: ['./hire-me.component.css']
})
export class HireMeComponent {

  constructor(private ruta: Router){}

  onSubmit(){
       //dupa ce se trimite info la server, se navigheaza la pagina principala
       this.ruta.navigate(['/'])
  }

}
