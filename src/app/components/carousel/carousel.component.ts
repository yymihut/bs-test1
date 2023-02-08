import { Component, OnInit, Injectable } from '@angular/core';
import { CarouselConfig } from 'ngx-bootstrap/carousel';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
  providers: [
    { provide: CarouselConfig, useValue: { interval: 2500, noPause: false, showIndicators: true } }
 ],
})
@Injectable()
export class CarouselComponent implements OnInit {
  slides = [
     {image: './../../../assets/img/nature/image4.jpg', text: 'First'},
     {image: './../../../assets/img/nature/image5.jpg',text: 'Second'},
     {image: './../../../assets/img/nature/image3.jpg',text: 'Third'}
  ];
  noWrapSlides = false;
  showIndicator = true;
  constructor() { }

  ngOnInit(): void {
  }
}


