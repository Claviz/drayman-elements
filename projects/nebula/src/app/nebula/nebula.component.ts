import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as stardust from '@nebula.js/stardust';

// import EnigmaMocker from '../../enigma-mocker';
import { requireFrom } from '../../custom-d3-require';
import { patchRangeBrush, rangeBrushGlobals } from '../../range-brush';
// import treemap from '../../../sn-treemap/sn-treemap';
// import datepicker from 'nebula-date-range-picker/dist/nebula-date-range-picker';

// Longest wait for the confirmed layout before the chart shows its own view again.
const frozenViewTimeoutMs = 5000;
// Longest wait for a chart to redraw new data in place.
const updateTimeoutMs = 10_000;
const errorUpdateTimeoutMs = 300;
const fadeMs = 200;

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// Nebula's model of a rendered chart. New data goes to the same chart, which animates to it
// the way Qlik Sense charts do.
interface ChartSource {
  id: string;
  layout: any;
  listeners: Set<() => void>;
}

@Component({
  selector: 'drayman-nebula-internal',
  templateUrl: './nebula.component.html',
  styleUrls: ['./nebula.component.scss']
})
export class NebulaComponent implements AfterViewInit, OnChanges, OnDestroy {
  private static nextAppId = 0;
  private layout: any;
  // Layouts can be megabytes; each one is serialized once.
  private layoutJson: string;
  @Input() set qLayout(value: any) {
    this.layout = value;
    this.layoutJson = JSON.stringify(value);
    // Register render work as soon as the view is patched, before a queued hide
    // can run. Angular's render hook may execute on a later browser turn.
    this.layoutChanged = this.layoutJson !== this.oldLayoutJson;
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
  private source?: ChartSource;
  // Nebula removes the selection highlight as soon as a selection is confirmed, but the
  // confirmed layout comes later. A copy of the highlighted view covers the chart until then.
  private inSelections = false;
  // A selection with nothing selected (a tap on empty space) brings no new layout to wait for.
  private selectionMade = false;
  private selectionSnapshot?: HTMLElement;
  private frozenView?: HTMLElement;
  private frozenRevision = 0;
  private frozenTimeout;
  // Charts confirm their selection on Enter and cancel it on Escape. The server ends
  // selections made with the pointer itself, but it doesn't see these keys.
  private handlingKey = false;
  // Ending a selection on the server waits for the selection calls before it.
  private serverSelections: Promise<unknown> = Promise.resolve();

  async ngAfterViewInit() {
    this.viewReady = true;
    // Capture runs before Nebula's click-out handler redraws the chart.
    document.addEventListener('pointerdown', this.onPointerDown, true);
    document.addEventListener('keydown', this.onKeyDown, true);
    document.addEventListener('keyup', this.onKeyUp, true);
    await this.render();
  }

  private onPointerDown = (event: PointerEvent) => {
    // A close button cancels the selection, and the chart below already shows the result.
    const button: any = (event.target as Element)?.closest?.('drayman-button');
    const cancels = button?.icon === 'close';
    this.selectionSnapshot = this.inSelections && this.vizContainer && !cancels ? this.copyView(this.vizContainer) : undefined;
  };

  // Keyboard selections would make the snapshot stale.
  private onKeyDown = () => {
    this.selectionSnapshot = undefined;
    this.markKey();
  };

  // Charts handle Enter and Escape when the key goes up.
  private onKeyUp = (event: KeyboardEvent) => {
    const view = event.key === 'Enter' && this.inSelections ? this.vizContainer : undefined;
    this.selectionSnapshot = view ? this.copyView(view) : undefined;
    this.markKey();
  };

  private markKey() {
    this.handlingKey = true;
    setTimeout(() => this.handlingKey = false);
  }

  private async selectOnServer(method: string, selections: any[]) {
    this.selectionMade = true;
    const call = this.onSelections?.({ selections, method });
    this.serverSelections = Promise.all([this.serverSelections, call]).catch(() => undefined);
    await call;
  }

  private endSelectionsOnServer(accept: boolean) {
    this.serverSelections = this.serverSelections
      .then(() => this.onVizMethod?.({ name: 'endSelections', args: [accept] }))
      .catch(error => console.error('Ending the Qlik selection failed:', error));
  }

  private copyView(view: HTMLElement) {
    const copy = view.cloneNode(true) as HTMLElement;
    // Clones keep canvas sizes but not their pixels.
    const canvases = view.querySelectorAll('canvas');
    copy.querySelectorAll('canvas').forEach((canvas, i) => {
      if (canvases[i].width && canvases[i].height) canvas.getContext('2d')?.drawImage(canvases[i], 0, 0);
    });
    copy.setAttribute('inert', '');
    copy.setAttribute('aria-hidden', 'true');
    return copy;
  }

  private freezeView(view?: HTMLElement) {
    if (this.disposed || !view || !this.vizContainer) return;
    this.unfreezeView();
    this.vizContainer.style.visibility = 'hidden';
    this.vizEl.nativeElement.appendChild(view);
    this.frozenView = view;
    this.frozenRevision = this.renderRevision;
    this.frozenTimeout = setTimeout(() => {
      // A layout received after the confirmation replaces the copy once rendered.
      if (!this.rendering || this.renderRevision === this.frozenRevision) this.unfreezeView(true);
    }, frozenViewTimeoutMs);
  }

  private unfreezeView(fade = false) {
    clearTimeout(this.frozenTimeout);
    const view = this.frozenView;
    if (!view) return;
    this.frozenView = undefined;
    if (this.vizContainer) this.vizContainer.style.visibility = '';
    if (fade) this.crossfade(view, this.vizContainer);
    else view.remove();
  }

  // Fades the outgoing view into the incoming one, then removes it.
  private crossfade(outgoing: HTMLElement | undefined, incoming?: HTMLElement) {
    if (reducedMotion()) {
      outgoing?.remove();
      return;
    }
    const timing = { duration: fadeMs, easing: 'ease-out' };
    incoming?.animate([{ opacity: 0 }, { opacity: 1 }], timing);
    if (!outgoing) return;
    const remove = () => outgoing.remove();
    outgoing.animate([{ opacity: 1 }, { opacity: 0 }], { ...timing, fill: 'forwards' }).finished.then(remove, remove);
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
        this.oldLayoutJson = this.layoutJson;
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
      // A layout received after the confirmation has been rendered.
      if (this.renderRevision > this.frozenRevision) this.unfreezeView(true);
      this.reportRendering(false);
    }
  }

  private async renderLayout(layout: any, revision: number) {
    // A new chart is built only for the first layout, another chart type, or a selection the
    // chart still holds although the server ended it (rebuilding drops it).
    if (this.viz && !this.inSelections && this.source?.layout.visualization === layout.visualization) {
      await this.updateLayout(this.source, layout);
      return;
    }
    const source: ChartSource = { id: layout.qInfo.qId, layout, listeners: new Set() };
    const genericObject = {
      getLayout: () => {
        return source.layout;
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
        return source.layout.qHyperCube.qDataPages;
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
        this.inSelections = true;
        this.selectionMade = false;
        this.vizContainer?.classList.remove('selection-ended');
      },
      selectHyperCubeContinuousRange: (...args) => this.selectOnServer('selectHyperCubeContinuousRange', args),
      selectHyperCubeValues: (...args) => this.selectOnServer('selectHyperCubeValues', args),
      selectListObjectValues: (...args) => this.selectOnServer('selectListObjectValues', args),
      selectPivotCells: (...args) => this.selectOnServer('selectPivotCells', args),
      rangeSelectHyperCubeValues: (...args) => this.selectOnServer('rangeSelectHyperCubeValues', args),
      resetMadeSelections: (...args) => {
      },
      clearSelections: (...args) => {
      },
      // Nebula calls this right after it has redrawn the chart without the highlight.
      endSelections: (accept) => {
        this.inSelections = false;
        this.vizContainer?.classList.add('selection-ended');
        if (accept && this.selectionMade) this.freezeView(this.selectionSnapshot);
        this.selectionSnapshot = undefined;
        if (this.handlingKey) this.endSelectionsOnServer(accept);
      },
      // Nebula reads the layout again when the model changes.
      on: (event: string, listener: () => void) => {
        if (event === 'changed') source.listeners.add(listener);
      },
      removeListener: (event: string, listener: () => void) => {
        if (event === 'changed') source.listeners.delete(listener);
      },
      useKeyboard: (...args) => {
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
      if (objectId === source.id) {
        return await preservedGetObject(source.id);
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

    const loadNebulaChart = requireFrom((name) => (this.nebulaPackagesUrl ? `${this.nebulaPackagesUrl}/${name}` : `https://unpkg.com/@nebula.js/${name}`), {
      transform: patchRangeBrush,
      globals: rangeBrushGlobals,
    }).alias({
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
          id: source.id,
          // Nebula 5.11 wires onRender only when options are supplied. Line charts animate
          // only when asked; the other charts animate unless told not to.
          options: { chartAnimations: !reducedMotion() },
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
      // The new chart fades in over a copy of the old one, unless a frozen copy already covers it.
      const previous = this.vizContainer && !this.frozenView ? this.copyView(this.vizContainer) : undefined;
      // Destroying a view confirms its open selection; that must not freeze the new view.
      this.inSelections = false;
      this.selectionSnapshot = undefined;
      this.viz?.destroy();
      this.destroyApp();
      this.vizContainer?.remove();
      this.viz = nextViz;
      this.app = app;
      this.n = n;
      this.source = source;
      this.vizContainer = container;
      container.style.opacity = '';
      container.style.pointerEvents = '';
      if (previous) this.vizEl.nativeElement.appendChild(previous);
      if (!this.frozenView) this.crossfade(previous, container);
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

  // Nebula redraws the rendered chart when its model changes. The chart keeps the id it was
  // rendered with, while the server gives each layout a new one.
  private async updateLayout(source: ChartSource, layout: any) {
    const rendered = this.chartRendered(this.vizContainer);
    source.layout = { ...layout, qInfo: { ...layout.qInfo, qId: source.id } };
    source.listeners.forEach(listener => listener());
    await rendered;
    // The redraw has dropped the ranges of the ended selection.
    this.vizContainer?.classList.remove('selection-ended');
  }

  // Nebula counts finished renders on the chart's element, which an error panel replaces.
  private chartRendered(container?: HTMLElement) {
    if (!container) return Promise.resolve();
    const counter = () => container.querySelector('[data-render-count]');
    const element = counter();
    const count = element?.getAttribute('data-render-count');
    return new Promise<void>(resolve => {
      const done = () => {
        observer.disconnect();
        clearTimeout(timeout);
        this.cancelRender = undefined;
        resolve();
      };
      const observer = new MutationObserver(() => {
        const current = counter();
        if (current !== element || current?.getAttribute('data-render-count') !== count) done();
      });
      observer.observe(container, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-render-count'] });
      // An error panel has no counter and may not change at all.
      const timeout = setTimeout(done, element ? updateTimeoutMs : errorUpdateTimeoutMs);
      // A newer layout doesn't wait for this one.
      this.cancelRender = done;
    });
  }

  destroyApp(app = this.app) {
    if (app) document.querySelector(`div[data-app-id='${app.id}']`)?.remove();
    if (app === this.app) this.app = undefined;
  }

  ngOnDestroy(): void {
    this.disposed = true;
    ++this.renderRevision;
    this.cancelRender?.();
    document.removeEventListener('pointerdown', this.onPointerDown, true);
    document.removeEventListener('keydown', this.onKeyDown, true);
    document.removeEventListener('keyup', this.onKeyUp, true);
    this.selectionSnapshot = undefined;
    this.unfreezeView();
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
