import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GaugeComponent } from './gauge/gauge.component';
import { NgxGaugeModule } from 'ngx-gauge';
import { AngularResizedEventModule } from 'angular-resize-event';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    NgxGaugeModule,
    AngularResizedEventModule,
  ],
  declarations: [GaugeComponent],
  exports: [GaugeComponent],
})
export class GaugeModule {
  constructor(private injector: Injector) {
  }

  ngDoBootstrap() {
    const el = createCustomElement(GaugeComponent, { injector: this.injector, });
    customElements.define('drayman-gauge', el);
  }
}