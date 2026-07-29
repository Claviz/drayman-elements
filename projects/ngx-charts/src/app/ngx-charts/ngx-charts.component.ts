import { AfterViewInit, Component, Input, OnChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { TooltipService } from '@swimlane/ngx-charts';
import { ResizedEvent } from 'angular-resize-event';

import { DraymanNgxCharts, DraymanNgxChartType } from '../models/ngx-charts-options';

@Component({
  selector: 'drayman-ngx-charts-internal',
  templateUrl: './ngx-charts.component.html',
  styleUrls: ['./ngx-charts.component.scss']
})
export class NgxChartsComponent implements OnChanges, AfterViewInit {

  @ViewChild('chartContainer', { read: ViewContainerRef, static: true }) public chartContainer: ViewContainerRef;

  @Input() onSelect?: (data: any) => Promise<void>;
  @Input() onActivate?: (data: any) => Promise<void>;
  @Input() onDeactivate?: (data: any) => Promise<void>;
  @Input() onDblClick?: (data: any) => Promise<void>;
  @Input() type: DraymanNgxChartType;
  @Input() results?: any[];
  @Input() view?: [number, number];
  @Input() legendTitle?: string;
  @Input() scheme?: any;
  @Input() animations?: boolean;
  @Input() legend?: boolean;
  @Input() labels?: boolean;
  @Input() customColors?: any;
  @Input() schemeType?: 'ordinal' | 'linear';
  @Input() explodeSlices?: boolean;
  @Input() doughnut?: boolean;
  @Input() arcWidth?: number;
  @Input() gradient?: boolean;
  @Input() activeEntries?: any[];
  @Input() tooltipDisabled?: boolean;
  @Input() tooltipText?: any;
  @Input() trimLabels?: boolean;
  @Input() maxLabelLength?: number;
  @Input() xAxis?: boolean;
  @Input() yAxis?: boolean;
  @Input() showXAxisLabel?: boolean;
  @Input() showYAxisLabel?: boolean;
  @Input() xAxisLabel?: string;
  @Input() yAxisLabel?: string;
  @Input() showGridLines?: boolean;
  @Input() trimXAxisTicks?: boolean;
  @Input() trimYAxisTicks?: boolean;
  @Input() rotateXAxisTicks?: boolean;
  @Input() maxXAxisTickLength?: number;
  @Input() maxYAxisTickLength?: number;
  @Input() xAxisTickFormatting?: any;
  @Input() yAxisTickFormatting?: any;
  @Input() axisTickFormatting?: any;
  @Input() xAxisTicks?: any[];
  @Input() yAxisTicks?: any[];
  @Input() barPadding?: number;
  @Input() groupPadding?: number;
  @Input() roundDomains?: boolean;
  @Input() roundEdges?: boolean;
  @Input() noBarWhenZero?: boolean;
  @Input() xScaleMax?: any;
  @Input() xScaleMin?: any;
  @Input() yScaleMax?: number;
  @Input() yScaleMin?: number;
  @Input() showDataLabel?: boolean;
  @Input() dataLabelFormatting?: any;
  @Input() cardColor?: string;
  @Input() bandColor?: string;
  @Input() emptyColor?: string;
  @Input() innerPadding?: number | number[];
  @Input() textColor?: string;
  @Input() legendPosition?: 'right' | 'below';
  @Input() min?: number;
  @Input() max?: number;
  @Input() units?: string;
  @Input() bigSegments?: number;
  @Input() smallSegments?: number;
  @Input() showAxis?: boolean;
  @Input() showText?: boolean;
  @Input() textValue?: string;
  @Input() margin?: number[];
  @Input() startAngle?: number;
  @Input() angleSpan?: number;
  @Input() timeline?: boolean;
  @Input() autoScale?: boolean;
  @Input() rangeFillOpacity?: number;
  @Input() showRefLines?: boolean;
  @Input() referenceLines?: any[];
  @Input() showRefLabels?: boolean;
  @Input() baseValue?: number | 'auto';
  @Input() value?: number;
  @Input() previousValue?: number;
  @Input() maxRadius?: number;
  @Input() minRadius?: number;
  @Input() label?: string;
  @Input() minWidth?: number;
  @Input() designatedTotal?: number;
  @Input() valueFormatting?: any;
  @Input() nameFormatting?: any;
  @Input() percentageFormatting?: any;
  @Input() labelFormatting?: any;
  @Input() showSeriesOnHover?: boolean;
  @Input() yAxisMinScale?: number;
  @Input() labelTrim?: boolean;
  @Input() labelTrimSize?: number;

  chart: DraymanNgxCharts;

  constructor(private tooltipService: TooltipService) { }

  ngAfterViewInit() {
    this.tooltipService.injectionService.setRootViewContainer(this.chartContainer);
  }

  onResized(event: ResizedEvent) {
    window.dispatchEvent(new Event('resize'));
  }

  ngOnChanges() {
    const isGauge = this.type === 'gauge' || this.type === 'linearGauge';

    this.chart = {
      type: this.type,
      results: this.results ?? [],
      view: this.view,
      legendTitle: this.legendTitle ?? 'Legend',
      scheme: this.scheme ?? 'cool',
      animations: this.animations ?? true,
      legend: this.legend ?? false,
      labels: this.labels ?? false,
      customColors: this.customColors,
      schemeType: this.schemeType ?? 'ordinal',
      explodeSlices: this.explodeSlices ?? false,
      doughnut: this.doughnut ?? false,
      arcWidth: this.arcWidth ?? 0.25,
      gradient: this.gradient ?? false,
      activeEntries: this.activeEntries ?? [],
      tooltipDisabled: this.tooltipDisabled ?? false,
      tooltipText: this.tooltipText,
      trimLabels: this.trimLabels ?? true,
      maxLabelLength: this.maxLabelLength ?? 10,
      xAxis: this.xAxis,
      yAxis: this.yAxis,
      showXAxisLabel: this.showXAxisLabel,
      showYAxisLabel: this.showYAxisLabel,
      xAxisLabel: this.xAxisLabel,
      yAxisLabel: this.yAxisLabel,
      showGridLines: this.showGridLines ?? true,
      trimXAxisTicks: this.trimXAxisTicks ?? true,
      trimYAxisTicks: this.trimYAxisTicks ?? true,
      rotateXAxisTicks: this.rotateXAxisTicks ?? true,
      maxXAxisTickLength: this.maxXAxisTickLength ?? 16,
      maxYAxisTickLength: this.maxYAxisTickLength ?? 16,
      xAxisTickFormatting: this.xAxisTickFormatting,
      yAxisTickFormatting: this.yAxisTickFormatting,
      axisTickFormatting: this.axisTickFormatting,
      xAxisTicks: this.xAxisTicks,
      yAxisTicks: this.yAxisTicks,
      barPadding: this.barPadding ?? 8,
      groupPadding: this.groupPadding ?? 16,
      roundDomains: this.roundDomains ?? false,
      roundEdges: this.roundEdges ?? true,
      noBarWhenZero: this.noBarWhenZero ?? true,
      xScaleMax: this.xScaleMax,
      xScaleMin: this.xScaleMin,
      yScaleMax: this.yScaleMax,
      yScaleMin: this.yScaleMin,
      showDataLabel: this.showDataLabel ?? false,
      dataLabelFormatting: this.dataLabelFormatting,
      cardColor: this.cardColor,
      bandColor: this.bandColor,
      emptyColor: this.emptyColor ?? 'rgba(0, 0, 0, 0)',
      innerPadding: this.innerPadding ?? (this.type === 'heatMap' ? 8 : 15),
      textColor: this.textColor,
      legendPosition: this.legendPosition ?? 'right',
      min: this.min ?? (isGauge ? 0 : undefined),
      max: this.max ?? (isGauge ? 100 : undefined),
      units: this.units,
      bigSegments: this.bigSegments ?? 10,
      smallSegments: this.smallSegments ?? 5,
      showAxis: this.showAxis ?? true,
      showText: this.showText ?? true,
      textValue: this.textValue,
      margin: this.margin,
      startAngle: this.startAngle ?? -120,
      angleSpan: this.angleSpan ?? 240,
      timeline: this.timeline,
      autoScale: this.autoScale,
      rangeFillOpacity: this.rangeFillOpacity ?? 0.15,
      showRefLines: this.showRefLines ?? false,
      referenceLines: this.referenceLines,
      showRefLabels: this.showRefLabels ?? true,
      baseValue: this.baseValue ?? 'auto',
      value: this.value ?? 0,
      previousValue: this.previousValue,
      maxRadius: this.maxRadius ?? 10,
      minRadius: this.minRadius ?? 3,
      label: this.label ?? 'Total',
      minWidth: this.minWidth ?? 150,
      designatedTotal: this.designatedTotal,
      valueFormatting: this.valueFormatting,
      nameFormatting: this.nameFormatting,
      percentageFormatting: this.percentageFormatting,
      labelFormatting: this.labelFormatting,
      showSeriesOnHover: this.showSeriesOnHover ?? true,
      yAxisMinScale: this.yAxisMinScale ?? 0,
      labelTrim: this.labelTrim ?? true,
      labelTrimSize: this.labelTrimSize ?? 10,
    };
  }
}
