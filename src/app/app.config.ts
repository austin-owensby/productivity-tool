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
      { name: 'gridSize', keypath: 'gridSize', options: { unique: false } },
      { name: 'showGridBehavior', keypath: 'showGridBehavior', options: { unique: false } },

      { name: 'editViewIsDefault', keypath: 'editViewIsDefault', options: { unique: false } },
      { name: 'deleteCardInReadonly', keypath: 'deleteCardInReadonly', options: { unique: false } },
      { name: 'dragCardInReadonly', keypath: 'dragCardInReadonly', options: { unique: false } },
      { name: 'resizeCardInReadonly', keypath: 'resizeCardInReadonly', options: { unique: false } },
      { name: 'updateNoteGroupTitleInReadonly', keypath: 'updateNoteGroupTitleInReadonly', options: { unique: false } },
      { name: 'deleteNoteInReadonly', keypath: 'deleteNoteInReadonly', options: { unique: false } },
      { name: 'addNoteInReadonly', keypath: 'addNoteInReadonly', options: { unique: false } },
      { name: 'updateNoteInReadonly', keypath: 'updateNoteInReadonly', options: { unique: false } },
      { name: 'dragNoteInReadonly', keypath: 'dragNoteInReadonly', options: { unique: false } },
      
      { name: 'backgroundColor', keypath: 'backgroundColor', options: { unique: false } },
      { name: 'gridLineColor', keypath: 'gridLineColor', options: { unique: false } },

      { name: 'emptyCardColor', keypath: 'emptyCardColor', options: { unique: false } },
      { name: 'emptyCardTextColor', keypath: 'emptyCardTextColor', options: { unique: false } },
      { name: 'emptyCardBorderColor', keypath: 'emptyCardBorderColor', options: { unique: false } },
      { name: 'emptyCardButtonColor', keypath: 'emptyCardButtonColor', options: { unique: false } },
      { name: 'emptyCardButtonBackgroundColor', keypath: 'emptyCardButtonBackgroundColor', options: { unique: false } },
      
      { name: 'noteGroupColor', keypath: 'noteGroupColor', options: { unique: false } },
      { name: 'noteGroupTextColor', keypath: 'noteGroupTextColor', options: { unique: false } },
      { name: 'noteGroupBorderColor', keypath: 'noteGroupBorderColor', options: { unique: false } },
      { name: 'noteGroupButtonColor', keypath: 'noteGroupButtonColor', options: { unique: false } },
      { name: 'noteGroupButtonBackgroundColor', keypath: 'noteGroupButtonBackgroundColor', options: { unique: false } },
      { name: 'noteColor', keypath: 'noteColor', options: { unique: false } },
      { name: 'noteTextColor', keypath: 'noteTextColor', options: { unique: false } },
      { name: 'noteBorderColor', keypath: 'noteBorderColor', options: { unique: false } },
      { name: 'noteButtonColor', keypath: 'noteButtonColor', options: { unique: false } },
      { name: 'noteButtonBackgroundColor', keypath: 'noteButtonBackgroundColor', options: { unique: false } },
    ]
  }, {
    store: 'noteGroups',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'title', keypath: 'title', options: { unique: false } },
      { name: 'type', keypath: 'type', options: { unique: false } },
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
      { name: 'type', keypath: 'type', options: { unique: false } },
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
