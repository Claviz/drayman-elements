import { Component, Input, EventEmitter, Output, OnInit, AfterViewInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';

import { embed } from '@nebula.js/stardust';
import enigma from 'enigma.js';
import SenseUtilities from 'enigma.js/sense-utilities';
import schema from 'enigma.js/schemas/12.170.2.json';
import * as stardust from '@nebula.js/stardust';
import { requireFrom } from 'd3-require';

const loadNebulaChart = requireFrom((name) => `https://unpkg.com/@nebula.js/${name}`).alias({
  '@nebula.js/stardust': stardust,
});
@Component({
  selector: 'drayman-nebula-internal',
  templateUrl: './nebula.component.html',
  styleUrls: ['./nebula.component.scss']
})
export class NebulaComponent implements AfterViewInit {
  @Input() configuration: any;
  @Input() vizId: string;
  @Input() showToolbar: boolean;

  @ViewChild('toolbar', { static: false }) toolbarEl: ElementRef;
  @ViewChild('viz', { static: false }) vizEl: ElementRef;

  async ngAfterViewInit() {
    const url = SenseUtilities.buildUrl(this.configuration);
    const connect = async (appId) => {
      const enigmaGlobal = await enigma
        .create({ schema, url, })
        .open();
      // enigmaGlobal.on('traffic:*', (direction, msg) => console.log(direction, msg));

      return enigmaGlobal.openDoc(appId);
    }
    const app = await connect(this.configuration.appId);
    const types = [
      ['sn-action-button', 'action-button'],
      ['sn-bar-chart', 'barchart'],
      ['sn-bullet-chart', 'bullet-chart'],
      ['sn-combo-chart', 'combo-chart'],
      ['sn-funnel-chart', 'funnel-chart'],
      ['sn-grid-chart', 'sn-grid-chart'],
      ['sn-kpi', 'kpi'],
      ['sn-line-chart', 'line-chart'],
      ['sn-mekko-chart', 'mekko'],
      ['sn-org-chart', 'org'],
      ['sn-pie-chart', 'piechart'],
      ['sn-sankey-chart', 'sankey'],
      ['sn-table', 'table'],
      ['sn-video-player', 'video-player'],
      ['sn-scatter-plot', 'scatterplot'],
    ].map((t) => ({
      name: t[1],
      load: () => loadNebulaChart(t[0]),
    }));
    const baseConfig = stardust.embed.createConfiguration({ types });
    const n = baseConfig(app);
    console.log(await n.selections());
    if (this.showToolbar) {
      (await n.selections()).mount(this.toolbarEl.nativeElement);
    }
    if (this.vizId) {
      n.render({
        element: this.vizEl.nativeElement,
        id: this.vizId,
      });
    }
  }

}
