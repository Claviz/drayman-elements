import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SupersetComponent } from './superset/superset.component';

@NgModule({
  declarations: [SupersetComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
  ],
  providers: [],
})
export class SupersetModule {
  constructor(private injector: Injector) {
  }

  ngDoBootstrap() {
    const el = createCustomElement(SupersetComponent, { injector: this.injector, });
    customElements.define('drayman-superset', el);
  }
}
