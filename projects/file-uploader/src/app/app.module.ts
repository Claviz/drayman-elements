import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ElementZoneStrategyFactory } from 'elements-zone-strategy';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginGetFile from 'filepond-plugin-get-file';
import { FilePondModule, registerPlugin } from 'ngx-filepond';

import { FileUploaderComponent } from './file-uploader/file-uploader.component';

registerPlugin(FilePondPluginGetFile);
registerPlugin(FilePondPluginFileValidateSize);

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FilePondModule,
  ],
  declarations: [FileUploaderComponent],
  entryComponents: [FileUploaderComponent],
  exports: [FileUploaderComponent],
})
export class FileUploaderModule {
  constructor(private injector: Injector) {
  }

  ngDoBootstrap() {
    const strategyFactory = new ElementZoneStrategyFactory(FileUploaderComponent, this.injector);
    const el = createCustomElement(FileUploaderComponent, { injector: this.injector, strategyFactory });
    customElements.define('drayman-file-uploader', el);
  }
}