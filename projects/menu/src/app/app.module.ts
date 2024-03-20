import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'projects/button/src/app/app.module';
import { MatMenuModule } from '@angular/material/menu';

import { MenuComponent } from './menu/menu.component';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SingleOverlayContainer } from 'mat-single-overlay';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    MatMenuModule,
    MatIconModule,
  ],
  declarations: [MenuComponent, MenuItemComponent],
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
export class MenuModule {
  constructor(private injector: Injector) {
  }

  ngDoBootstrap() {
    const el = createCustomElement(MenuComponent, { injector: this.injector, });
    customElements.define('drayman-menu', el);
  }
}