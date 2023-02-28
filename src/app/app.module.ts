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
import { FilterPipe } from './filter.pipe';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MesajeComponent } from './mesaje/mesaje.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { LoggingInterceptorService } from './services/logging-interceptor.service';
import { AuthComponent } from './auth/auth/auth.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';
import { VerifyemailComponent } from './components/verifyemail/verifyemail.component';
import {provideDatabase, getDatabase} from '@angular/fire/database'
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';

const routingulAplicatiei: Routes = [
  { path: '', component: HomeComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'hireme', component: HireMeComponent },
  { path: 'mesaje', component: MesajeComponent },
  { path: 'verify-email-address', component: VerifyemailComponent },
  { path: 'cv', component: CVComponent },
  { path: 'not-found', component: NotfoundPageComponent },
  { path: 'auth', component: AuthComponent },
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
    FilterPipe,
    MesajeComponent,
    AuthComponent,
    VerifyemailComponent,
  ],
  providers: [
    ImageService,
    [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptorService,
        multi: true,
      },
      {
        provide: HTTP_INTERCEPTORS,
        useClass: LoggingInterceptorService,
        multi: true,
      },
    ],
  ],
  bootstrap: [AppComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    NgbModule,
    CarouselModule,
    RouterModule.forRoot(routingulAplicatiei, {
      scrollPositionRestoration: 'enabled',
    }),
    SharedModule,
    BrowserAnimationsModule,
    HttpClientModule,
    provideFirebaseApp(()=> initializeApp(environment.firebase)),
    provideDatabase(()=>getDatabase()),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
  ],
})
export class AppModule {}
