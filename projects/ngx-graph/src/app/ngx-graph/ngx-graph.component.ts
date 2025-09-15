import { Component, Input, OnChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ResizedEvent } from 'angular-resize-event';

import { DraymanNgxGraph } from '../models/ngx-graph-options';

@Component({
  selector: 'drayman-ngx-graph-internal',
  templateUrl: './ngx-graph.component.html',
  styleUrls: ['./ngx-graph.component.scss']
})
export class NgxGraphComponent implements OnChanges {

  @Input() links?: any[];
  @Input() nodes?: any[];
  @Input() clusters?: any;
  @Input() showMiniMap?: boolean;
  @Input() draggingEnabled?: boolean;
  @Input() autoCenter?: boolean;
  @Input() autoZoom?: boolean;
  @Input() onNodeClick?: () => Promise<void>;
  @Input() onLinkClick?: () => Promise<void>;

  safeLinks: any[] = [];

  ngOnChanges() {
    this.safeLinks = (this.links || []).map(link => ({
      ...link,
      originalId: link.id,
      id: `edge-${link.id}`,
    }));
  }

  onResized(event: ResizedEvent) {
    window.dispatchEvent(new Event('resize'));
  }

  constructor(private sanitizer: DomSanitizer) { }

  getSanitizedString(value: string) {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

}
