import { Component, OnInit, ViewChild } from '@angular/core';
import { Image } from 'src/app/services/image.model';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit {


  images: Image[] = [];

  constructor(private imageServ: ImageService) {}

  ngOnInit() {
    this.images = this.imageServ.getImages();
  }
}
