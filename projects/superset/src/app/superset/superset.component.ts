import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { embedDashboard, EmbeddedDashboard } from '@superset-ui/embedded-sdk';

@Component({
  selector: 'drayman-superset-internal',
  templateUrl: './superset.component.html',
  styleUrls: ['./superset.component.scss']
})
export class SupersetComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() supersetDomain!: string;
  @Input() embedId!: string;
  @Input() guestToken?: string;
  @Input() onFetchGuestToken?: () => Promise<string>;
  @Input() dashboardUiConfig?: any;
  @Input() iframeSandboxExtras?: string[];
  @Input() referrerPolicy?: ReferrerPolicy;

  @ViewChild('mountPoint', { static: false }) mountPointEl?: ElementRef<HTMLElement>;

  async ngAfterViewInit() {
    const dashboard = await embedDashboard({
      id: this.embedId,
      supersetDomain: this.supersetDomain,
      mountPoint: this.mountPointEl.nativeElement,
      fetchGuestToken: this.onFetchGuestToken,
      dashboardUiConfig: this.dashboardUiConfig,
      iframeSandboxExtras: this.iframeSandboxExtras,
      referrerPolicy: this.referrerPolicy,
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnDestroy(): void {
  }
}
