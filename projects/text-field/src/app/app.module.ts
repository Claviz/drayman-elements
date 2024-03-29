import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TextFieldComponent } from './text-field/text-field.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxMaskModule } from 'ngx-mask'
import { OverlayContainer } from '@angular/cdk/overlay';
import { SingleOverlayContainer } from 'mat-single-overlay';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    NgxMaskModule.forRoot(),
  ],
  declarations: [TextFieldComponent],
  exports: [TextFieldComponent],
  providers: [
    { provide: OverlayContainer, useClass: SingleOverlayContainer, },
  ],
})
export class TextFieldModule {
  constructor(private injector: Injector) {
  }

  ngDoBootstrap() {
    const el = createCustomElement(TextFieldComponent, { injector: this.injector, });
    customElements.define('drayman-text-field', el);
  }
}