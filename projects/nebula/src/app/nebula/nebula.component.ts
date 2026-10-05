import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
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
  private static nextAppId = 0;
  private layout: any;
  @Input() set qLayout(value: any) {
    this.layout = value;
    // Register render work as soon as the view is patched, before a queued hide
    // can run. Angular's render hook may execute on a later browser turn.
    this.layoutChanged = JSON.stringify(value) !== this.oldLayoutJson;
    if (this.viewReady) this.reportRendering(this.rendering || (!!value && this.layoutChanged));
  }
  get qLayout() { return this.layout; }
  @Input() theme: any;
  @Output() renderStateChange = new EventEmitter<{ rendering: boolean }>();
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

  private oldLayoutJson: string;
  private layoutChanged = false;
  private viewReady = false;
  private disposed = false;
  private renderRevision = 0;
  private rendering = false;
  private cancelRender?: () => void;
  private reportedRendering = false;
  private vizContainer?: HTMLElement;

  async ngAfterViewInit() {
    this.viewReady = true;
    await this.render();
  }

  private reportRendering(rendering: boolean) {
    if (rendering === this.reportedRendering) return;
    this.reportedRendering = rendering;
    this.renderStateChange.emit({ rendering });
  }

  async render() {
    if (this.disposed || !this.qLayout) return;
    ++this.renderRevision;
    this.reportRendering(true);
    if (this.rendering) {
      this.cancelRender?.();
      return;
    }
    this.rendering = true;
    // Keep the previous view visible, but prevent selections against stale data.
    this.vizContainer?.setAttribute('inert', '');
    try {
      // One render at a time; intermediate updates are coalesced to the latest layout.
      let revision: number;
      do {
        revision = this.renderRevision;
        this.oldLayoutJson = JSON.stringify(this.qLayout);
        const layout = JSON.parse(this.oldLayoutJson);
        this.layoutChanged = false;
        try {
          await this.renderLayout(layout, revision);
        } catch (error) {
          console.error('Qlik chart render failed:', error);
        }
      } while (!this.disposed && revision !== this.renderRevision);
    } finally {
      this.rendering = false;
      this.vizContainer?.removeAttribute('inert');
      this.reportRendering(false);
    }
  }

  private async renderLayout(layout: any, revision: number) {
    const genericObject = {
      getLayout: () => {
        return layout;
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
        return layout.qHyperCube.qDataPages;
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
    const app: any = await stardust.EnigmaMocker.fromGenericObjects([genericObject,]);
    // Mocker's millisecond IDs can collide while two chart views coexist.
    app.id = `drayman-nebula-${++NebulaComponent.nextAppId}`;
    if (this.disposed || revision !== this.renderRevision) {
      this.destroyApp(app);
      return;
    }
    app.getMeasure = async (measureId) => {
      return {
        getMeasure: async () => {
          return await this.onGetMeasure({ measureId });
        },
        getProperties: async (...args) => {
          return await this.onGetMeasureProperties({ measureId, args });
        }
      };
    }
    const preservedGetObject = app.getObject;
    app.getObject = async (objectId) => {
      if (objectId === layout.qInfo.qId) {
        return await preservedGetObject(layout.qInfo.qId);
      }
      return {
        getLayout: async () => {
          return await this.onGetObject({ objectId });
        }
      };
    }
    app.getField = async (fieldId) => {
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
    app.getFieldDescription = async (fieldId) => {
      return this.onGetFieldDescription({ fieldId })
    }
    app.evaluate = async (expression) => {
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
      ['sn-gauge', 'gauge'],
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
    // Opacity keeps the replacement measurable while the current chart stays visible.
    const container = document.createElement('div');
    container.style.cssText = 'position: absolute; inset: 0; opacity: 0; pointer-events: none;';
    container.setAttribute('inert', '');
    this.vizEl.nativeElement.appendChild(container);
    let nextViz;
    let committed = false;
    let renderTimeout;
    let cancelled = false;
    try {
      const n = stardust.embed(app, {
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

      await new Promise<void>((resolve, reject) => {
        let initialRender = false;
        let controllerReady = false;
        // Wait for the pending controller before replacing it; disposal may exit early.
        this.cancelRender = () => {
          if (!controllerReady && !this.disposed) return;
          cancelled = true;
          resolve();
        };
        renderTimeout = setTimeout(() => reject(new Error('Qlik chart render timed out')), 90_000);
        const finish = () => { if (initialRender && controllerReady) resolve(); };
        n.render({
          element: container,
          id: layout.qInfo.qId,
          // Nebula 5.11 wires onRender only when options are supplied.
          options: {},
          onRender: () => { initialRender = true; finish(); },
          // An error panel is a completed view too; keep Nebula's message visible.
          onError: () => { initialRender = true; finish(); },
        }).then(viz => {
          if (cancelled || this.disposed || revision !== this.renderRevision) {
            viz.destroy();
            resolve();
            return;
          }
          nextViz = viz;
          controllerReady = true;
          finish();
        }, reject);
      });
      if (cancelled || this.disposed || revision !== this.renderRevision) return;
      this.viz?.destroy();
      this.destroyApp();
      this.vizContainer?.remove();
      this.viz = nextViz;
      this.app = app;
      this.n = n;
      this.vizContainer = container;
      container.style.opacity = '';
      container.style.pointerEvents = '';
      committed = true;
    } finally {
      cancelled = true;
      this.cancelRender = undefined;
      clearTimeout(renderTimeout);
      if (!committed) {
        nextViz?.destroy();
        this.destroyApp(app);
        container.remove();
      }
    }
  }

  destroyApp(app = this.app) {
    if (app) document.querySelector(`div[data-app-id='${app.id}']`)?.remove();
    if (app === this.app) this.app = undefined;
  }

  ngOnDestroy(): void {
    this.disposed = true;
    ++this.renderRevision;
    this.cancelRender?.();
    this.reportRendering(false);
    this.viz?.destroy();
    this.vizContainer?.remove();
    this.destroyApp();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (this.viewReady && this.layoutChanged) {
      await this.render();
    }
  }
}
