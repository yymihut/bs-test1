import { EventEmitter } from '@angular/core';
import { Image } from './image.model';

export class ImageService {
  imageArray = new EventEmitter<Image>();
  private images: Image[] = [
    new Image(
      new Date().getTime() * Math.random() * 100000,
      'test receipe',
      'este un test',
      '/assets/img/nature/image1.jpg?h=d679710e5ce8e4c2db35fde74a78a924'
    ),
    new Image(
      new Date().getTime() * Math.random() * 100000,
      'test receipe2',
      'este un test2',
      '/assets/img/nature/image2.jpg?h=c5fb06440e9759bec9433393cd5a9761'
    ),
    new Image(
      new Date().getTime() * Math.random() * 100000,
      'test receipe2',
      'este un test3',
      '/assets/img/nature/image3.jpg?h=3d10847c5ff6b1319937a4f817ef5f69'
    ),
    new Image(
      new Date().getTime() * Math.random() * 100000,
      'test receipe3',
      'este un test4',
      '/assets/img/nature/image4.jpg?h=1982116904e6a58b7261b01d77f07045'
    ),
    new Image(
      new Date().getTime() * Math.random() * 100000,
      'test receipe4',
      'este un test5',
      '/assets/img/nature/image5.jpg?h=dfa56246a493db02797b024ba354688f'
    ),
    new Image(
      new Date().getTime() * Math.random() * 100000,
      'test receipe5',
      'este un test5',
      '/assets/img/nature/image6.jpg?h=ac924de94d1857a219accf2126406ac1'
    ),
  ];
  getImages() {
    return this.images; //putem pune slice sa trimita o copie de array, sa nu afecteze originalul aray din recipe.service.ts
    // returneaza un nou array, o copie
  }

  getImageId(id: number) {
    const imgId = this.images.find((s) => {
      return s.id === id;
    });
    return imgId;
  }
}
