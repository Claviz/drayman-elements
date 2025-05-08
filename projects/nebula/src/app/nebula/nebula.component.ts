import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import * as stardust from '@nebula.js/stardust';

// import EnigmaMocker from '../../enigma-mocker';
import { requireFrom } from '../../custom-d3-require';
// import treemap from '../../../sn-treemap/sn-treemap';
// import datepicker from 'nebula-date-range-picker/dist/nebula-date-range-picker';

@Component({
  selector: 'drayman-nebula-internal',
  templateUrl: './nebula.component.html',
  styleUrls: ['./nebula.component.scss']
})
export class NebulaComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() qLayout: any;
  @Input() theme: any;
  @Input() onSelections?: (options) => Promise<any>;
  @Input() onVizMethod?: (options) => Promise<any>;
  @Input() onGetMeasure?: (options) => Promise<any>;
  @Input() onGetObject?: (options) => Promise<any>;
  @Input() onSelectFieldValues?: (options) => Promise<any>;
  @Input() onFieldSelectPossible?: (options) => Promise<any>;
  @Input() onFieldSelectAll?: (options) => Promise<any>;
  @Input() onGetFieldDescription?: (options) => Promise<any>;
  @Input() onEvaluate?: (options) => Promise<any>;
  @Input() onClearField?: (options) => Promise<any>;
  @Input() onGetMeasureProperties?: (options) => Promise<any>;
  @Input() nebulaPackagesUrl?: string;

  @ViewChild('toolbar', { static: false }) toolbarEl: ElementRef;
  @ViewChild('viz', { static: false }) vizEl: ElementRef;

  viz: any;
  n: any;
  app;

  async ngAfterViewInit() {
    await this.render();
  }

  async render() {
    this.oldQLayout = JSON.parse(JSON.stringify(this.qLayout));
    const genericObject = {
      getLayout: () => {
        return this.qLayout;
      },
      selectHyperCubeCells: (...args) => {
      },
      getEffectiveProperties: async (...args) => {
        return await this.onVizMethod({
          name: 'getEffectiveProperties',
          args,
        });
      },
      getHyperCubeReducedData: async (...args) => {
        return await this.onVizMethod({
          name: 'getHyperCubeReducedData',
          args,
        });
      },
      getHyperCubeData: async (...args) => {
        return await this.onVizMethod({
          name: 'getHyperCubeData',
          args,
        });
      },
      getHyperCubeStackData: async (...args) => {
        return await this.onVizMethod({
          name: 'getHyperCubeStackData',
          args,
        });
      },
      getHyperCubeContinuousData: async (...args) => {
        return await this.onVizMethod({
          name: 'getHyperCubeContinuousData',
          args,
        });
      },
      getStackedDataPages: (...args) => {
        return this.qLayout.qHyperCube.qDataPages;
      },
      getFullPropertyTree: () => {
      },
      getHyperCubeTreeData: async (...args) => {
        return await this.onVizMethod({
          name: 'getHyperCubeTreeData',
          args,
        });
      },
      beginSelections: (...args) => {
      },
      selectHyperCubeContinuousRange: async (...args) => {
        await this.onSelections?.({ selections: args, method: 'selectHyperCubeContinuousRange' })
      },
      selectHyperCubeValues: async (...args) => {
        await this.onSelections?.({ selections: args, method: 'selectHyperCubeValues' })
      },
      selectListObjectValues: async (...args) => {
        await this.onSelections?.({ selections: args, method: 'selectListObjectValues' })
      },
      selectPivotCells: async (...args) => {
        await this.onSelections?.({ selections: args, method: 'selectPivotCells' })
      },
      rangeSelectHyperCubeValues: async (...args) => {
        await this.onSelections?.({ selections: args, method: 'rangeSelectHyperCubeValues' })
      },
      resetMadeSelections: (...args) => {
      },
      clearSelections: (...args) => {
      },
      endSelections: (...args) => {
      },
      removeListener: (...args) => {
      },
      useKeyboard: (...args) => {
      },
      on: (...args) => {
      },
      getField: (...args) => {
      },
      selectValues: (...args) => {
      },
    };
    this.app = await stardust.EnigmaMocker.fromGenericObjects([genericObject,]);
    this.app.getMeasure = async (measureId) => {
      return {
        getMeasure: async () => {
          return await this.onGetMeasure({ measureId });
        },
        getProperties: async (...args) => {
          return await this.onGetMeasureProperties({ measureId, args });
        }
      };
    }
    const preservedGetObject = this.app.getObject;
    this.app.getObject = async (objectId) => {
      if (objectId === this.qLayout.qInfo.qId) {
        return await preservedGetObject(this.qLayout.qInfo.qId);
      }
      return {
        getLayout: async () => {
          return await this.onGetObject({ objectId });
        }
      };
    }
    this.app.getField = async (fieldId) => {
      return {
        selectValues: async (arr, toggle, softlock) => {
          return await this.onSelectFieldValues({ fieldId, arr, toggle, softlock });
        },
        clear: async () => {
          return await this.onClearField({ fieldId });
        },
        selectAll: async (softlock) => {
          return await this.onFieldSelectAll({ fieldId, softlock });
        },
        selectPossible: async (softlock) => {
          return await this.onFieldSelectPossible({ fieldId, softlock });
        },
      }
    }
    this.app.getFieldDescription = async (fieldId) => {
      return this.onGetFieldDescription({ fieldId })
    }
    this.app.evaluate = async (expression) => {
      return this.onEvaluate({ expression })
    }

    const loadNebulaChart = requireFrom((name) => (this.nebulaPackagesUrl ? `${this.nebulaPackagesUrl}/${name}` : `https://unpkg.com/@nebula.js/${name}`)).alias({
      '@nebula.js/stardust': stardust,
    });
    const types = [
      ['sn-action-button@1.38.1', 'action-button'],
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
      ['sn-treemap', 'treemap'],
      ['nebula-date-range-picker', 'qlik-date-picker'],
      ['nebula-radar-chart', 'qlik-radar-chart'],
      ['sn-pivot-table', 'pivot-table'],
      ['sn-map', 'map'],
      ['sn-text', 'sn-text'],
      ['sn-distplot', 'distributionplot'],
    ].map((t) => ({
      name: t[1],
      load: () => {
        // if (t[0] === 'sn-treemap') {
        //   return Promise.resolve(treemap);
        // }
        // if (t[0] === 'nebula-date-range-picker') {
        //   return Promise.resolve(datepicker);
        // }
        return loadNebulaChart(t[0]);
      },
    }));

    const themes = [
      {
        id: 'customTheme',
        load: async () => this.theme,
      },
    ];
    this.n = stardust.embed(this.app, {
      types,
      themes,
      context: {
        theme: 'customTheme',
      },
      flags: {
        IM_1869_HIDE_DIM_MEA_LINE: true,
        CLIENT_IM_3365: true,
      },
    } as any)

    if (this.qLayout) {
      this.viz = await this.n.render({
        element: this.vizEl.nativeElement,
        id: this.qLayout.qInfo.qId,
      });
    }
  }

  destroyApp() {
    document.querySelector(`div[data-app-id='${this.app.id}']`)?.remove();
  }

  ngOnDestroy(): void {
    this.destroyApp();
  }

  oldQLayout: any;
  async ngOnChanges(changes: SimpleChanges) {
    if (this.viz && JSON.stringify(this.qLayout) !== JSON.stringify(this.oldQLayout)) {
      this.viz.destroy();
      this.destroyApp();
      await this.render();
    }
  }

}
