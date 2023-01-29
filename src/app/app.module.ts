import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { HireMeComponent } from './components/hire-me/hire-me.component';
import { CVComponent } from './components/cv/cv.component';
import { Routes, RouterModule } from '@angular/router';

const routingulAplicatiei: Routes = [
  { path: '', component: HomeComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'hireme', component: HireMeComponent },
  { path: 'cv', component: CVComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    ProjectsComponent,
    HireMeComponent,
    CVComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    RouterModule.forRoot(routingulAplicatiei, {scrollPositionRestoration: 'enabled'}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
