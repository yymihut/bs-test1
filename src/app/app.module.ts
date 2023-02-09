import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { HireMeComponent } from './components/hire-me/hire-me.component';
import { CVComponent } from './components/cv/cv.component';
import { Routes, RouterModule } from '@angular/router';
import { ImageCardComponent } from './components/projects/imageCard/image-card/image-card.component';
import { ImageService } from './services/image.service';
import { NotfoundPageComponent } from './components/notfound-page/notfound-page.component';
import { FloatingCreditcardComponent } from './components/home/floating-creditcard/floating-creditcard.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselComponent } from './components/carousel/carousel.component';

const routingulAplicatiei: Routes = [
  { path: '', component: HomeComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'hireme', component: HireMeComponent },
  { path: 'cv', component: CVComponent },
  { path: 'not-found', component: NotfoundPageComponent },
  { path: '**', redirectTo: '/not-found' },
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    ProjectsComponent,
    HireMeComponent,
    CVComponent,
    ImageCardComponent,
    NotfoundPageComponent,
    FloatingCreditcardComponent,
    CarouselComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    NgbModule,
    CarouselModule,
    RouterModule.forRoot(routingulAplicatiei, {
      scrollPositionRestoration: 'enabled',
    }), //la incarcarea paginii o incarca de sus
    SharedModule,
    BrowserAnimationsModule, //am creeat un modul pt sheruirea mai multor componente
  ],
  providers: [ImageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
