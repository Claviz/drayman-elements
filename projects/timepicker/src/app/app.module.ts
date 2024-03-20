import { OverlayContainer } from '@angular/cdk/overlay';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SingleOverlayContainer } from 'mat-single-overlay';
import { NgxMaskModule } from 'ngx-mask';

import { TimepickerComponent } from './timepicker/timepicker.component';
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    FlexLayoutModule,
    MatButtonModule,
    MatTooltipModule,
    NgxMaskModule.forRoot(),
  ],
  exports: [TimepickerComponent],
  declarations: [TimepickerComponent],
  providers: [
    { provide: OverlayContainer, useClass: SingleOverlayContainer, },
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (iconRegistry: MatIconRegistry) => () => {
        iconRegistry.setDefaultFontSetClass('material-symbols-rounded');
      },
      deps: [MatIconRegistry]
    }
  ],
})
export class TimepickerModule {
  constructor(private injector: Injector) {
  }

  ngDoBootstrap() {
    const el = createCustomElement(TimepickerComponent, { injector: this.injector, });
    customElements.define('drayman-timepicker', el);
  }
}