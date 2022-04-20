import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CodeEditorComponent } from './code-editor/code-editor.component';
import { NgeMonacoModule } from '@mcisse/nge/monaco';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { FormsModule } from '@angular/forms';
import { AngularResizedEventModule } from 'angular-resize-event';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    FlexLayoutModule,
    CodemirrorModule,
    AngularResizedEventModule,
    // NgeMonacoModule.forRoot({}),
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