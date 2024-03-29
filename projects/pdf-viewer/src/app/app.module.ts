import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PdfViewerModule as Ng2PdfViewerModule } from 'ng2-pdf-viewer';

import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    Ng2PdfViewerModule,
  ],
  declarations: [PdfViewerComponent],
})
export class PdfViewerModule {
  constructor(private injector: Injector) {
  }

  ngDoBootstrap() {
    const el = createCustomElement(PdfViewerComponent, { injector: this.injector, });
    customElements.define('drayman-pdf-viewer', el);
  }
}