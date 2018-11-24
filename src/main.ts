import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import {LicenseManager} from 'ag-grid-enterprise';

if (environment.production) {
  enableProdMode();
}

LicenseManager.setLicenseKey('Evaluation_License_Not_For_Production_Valid_Until1' +
  '9_January_2019__MTU0Nzg1NjAwMDAwMA==17299dd5bd0d2fb6b1e08546ab5dcb90');

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
