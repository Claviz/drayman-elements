import { OverlayContainer } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularResizedEventModule } from 'angular-resize-event';
import { SingleOverlayContainer } from 'mat-single-overlay';
import { ButtonModule } from 'projects/button/src/app/app.module';
import { MatMenuModule } from '@angular/material/menu';

import { GridComponent } from './grid/grid.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ScrollingModule,
    AngularResizedEventModule,
    ButtonModule,
    MatMenuModule,
  ],
  declarations: [GridComponent,],
  providers: [
    { provide: OverlayContainer, useClass: SingleOverlayContainer, },
  ],
})
export class GridModule {
  constructor(private injector: Injector) {
  }

  ngDoBootstrap() {
    const el = createCustomElement(GridComponent, { injector: this.injector, });
    customElements.define('drayman-grid', el);
  }
}