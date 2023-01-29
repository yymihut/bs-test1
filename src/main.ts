/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
