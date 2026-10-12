import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DagreLayout, Graph, GraphComponent } from '@swimlane/ngx-graph';
import { ResizedEvent } from 'angular-resize-event';

class ViewportDagreLayout extends DagreLayout {
  private initializedCamera?: GraphComponent;

  constructor(private component: NgxGraphComponent) {
    super();
  }

  run(graph: Graph): Graph {
    const result = super.run(graph);
    const { graphComponent: camera, preserveView } = this.component;
    if (!preserveView) {
      this.initializedCamera = undefined;
      return result;
    }
    if (camera && camera !== this.initializedCamera && result.nodes.length) {
      camera.panToNodeId(result.nodes[0].id);
      camera.pan(-camera.dims.width / 4, 0);
      this.initializedCamera = camera;
    }
    return result;
  }
}

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
  @Input() preserveView?: boolean;
  @Input() onNodeClick?: () => Promise<void>;
  @Input() onLinkClick?: () => Promise<void>;
  @ViewChild(GraphComponent) graphComponent?: GraphComponent;

  safeLinks: any[] = [];
  readonly viewportLayout = new ViewportDagreLayout(this);

  ngOnChanges(): void {
    this.safeLinks = (this.links || []).map((link, i) => ({
      ...link,
      originalId: link.id || i,
      id: `edge-${link.id || i}`,
    }));
  }

  onResized(event: ResizedEvent): void {
    window.dispatchEvent(new Event('resize'));
  }

  constructor(private sanitizer: DomSanitizer) { }

  getSanitizedString(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

}
