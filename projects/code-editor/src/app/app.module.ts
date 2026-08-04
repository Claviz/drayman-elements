import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';

import { CodeEditorComponent } from './code-editor/code-editor.component';

@NgModule({
  imports: [
    BrowserModule,
  ],
  providers: [
  ],
  declarations: [CodeEditorComponent],
  exports: [CodeEditorComponent],
})
export class CodeEditorModule {
  constructor(private injector: Injector) {
  }

  ngDoBootstrap() {
    const el = createCustomElement(CodeEditorComponent, { injector: this.injector, });
    customElements.define('drayman-code-editor', el);
  }
}
