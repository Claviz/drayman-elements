import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayContainer } from '@angular/cdk/overlay';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SingleOverlayContainer } from 'mat-single-overlay';
import { ButtonModule } from 'projects/button/src/app/app.module';
import { CheckboxModule } from 'projects/checkbox/src/app/app.module';
import { DatepickerModule } from 'projects/datepicker/src/app/app.module';
import { FileUploaderModule } from 'projects/file-uploader/src/app/app.module';
import { NumberFieldModule } from 'projects/number-field/src/app/app.module';
import { SelectModule } from 'projects/select/src/app/app.module';
import { TextFieldModule } from 'projects/text-field/src/app/app.module';
import { TimepickerModule } from 'projects/timepicker/src/app/app.module';

import { SafeHtmlPipe } from '../../../shared/pipes/safe-html';
import { TableComponent } from './table/table.component';
import { SliderModule } from 'projects/slider/src/app/app.module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTableModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressBarModule,
    ButtonModule,
    MatCheckboxModule,
    TextFieldModule,
    SelectModule,
    SliderModule,
    FileUploaderModule,
    NumberFieldModule,
    CheckboxModule,
    DatepickerModule,
    TimepickerModule,
  ],
  declarations: [TableComponent, SafeHtmlPipe,],
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
export class TableModule {
  constructor(private injector: Injector) {
  }
  ngDoBootstrap() {
    const el = createCustomElement(TableComponent, { injector: this.injector, });
    customElements.define('drayman-table', el);
  }
}