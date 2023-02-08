import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  title = 'GFG';

  images: any[] = [
    { image: '../../../assets/img/nature/image1.jpg' },
    { image: '../../../assets/img/nature/image2.jpg' },
    { image: '../../../assets/img/nature/image3.jpg' },
    { image: '../../../assets/img/nature/image4.jpg' },
    { image: '../../../assets/img/nature/image5.jpg' },
    { image: '../../../assets/img/nature/image6.jpg' },
    { image: '../../../assets/img/tech/image4.jpg' },
    { image: '../../../assets/img/tech/image5.jpg' },
    { image: '../../../assets/img/avatars/avatar.jpg' },
    { image: '../../../assets/img/nature/image1.jpg' },
  ];
  responsiveOptions: any[] = [
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2,
    },
  ];
}
