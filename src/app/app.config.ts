import { ApplicationConfig, provideZoneChangeDetection, isDevMode, importProvidersFrom } from '@angular/core';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideServiceWorker } from '@angular/service-worker';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

const dbConfig: DBConfig = {
  name: 'ProductivityToolDB',
  version: 1,
  objectStoresMeta: [{
    store: 'settings',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'gridSize', keypath: 'gridSize', options: { unique: false } }
    ]
  }, {
    store: 'noteGroups',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'title', keypath: 'title', options: { unique: false } },
      { name: 'height', keypath: 'height', options: { unique: false } },
      { name: 'width', keypath: 'width', options: { unique: false } },
      { name: 'left', keypath: 'left', options: { unique: false } },
      { name: 'top', keypath: 'top', options: { unique: false } },
      { name: 'transform', keypath: 'transform', options: { unique: false } }
    ]
  }, {
    store: 'emptyCards',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'height', keypath: 'height', options: { unique: false } },
      { name: 'width', keypath: 'width', options: { unique: false } },
      { name: 'left', keypath: 'left', options: { unique: false } },
      { name: 'top', keypath: 'top', options: { unique: false } },
      { name: 'transform', keypath: 'transform', options: { unique: false } }
    ]
  }
]
};

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideAnimationsAsync(), provideServiceWorker('ngsw-worker.js', {
    enabled: !isDevMode(),
    registrationStrategy: 'registerWhenStable:30000'
  }), importProvidersFrom(NgxIndexedDBModule.forRoot(dbConfig)),
  {
    provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
    useValue: {
      subscriptSizing: 'dynamic'
    }
  }]
};
