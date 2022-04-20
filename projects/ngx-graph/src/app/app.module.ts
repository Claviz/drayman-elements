import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { AngularResizedEventModule } from 'angular-resize-event';
import { MatTooltipModule } from '@angular/material/tooltip';

import { NgxGraphComponent } from './ngx-graph/ngx-graph.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    NgxGraphModule,
    AngularResizedEventModule,
    MatTooltipModule,
  ],
  declarations: [NgxGraphComponent],
})
export class AppModule {
  constructor(private injector: Injector) {
  }

  ngDoBootstrap() {
    const el = createCustomElement(NgxGraphComponent, { injector: this.injector, });
    customElements.define('drayman-ngx-graph', el);
  }
}