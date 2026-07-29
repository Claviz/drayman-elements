export type DraymanNgxChartType =
    | 'pie'
    | 'advancedPie'
    | 'pieGrid'
    | 'verticalBar'
    | 'horizontalBar'
    | 'verticalBarGrouped'
    | 'horizontalBarGrouped'
    | 'verticalBarStacked'
    | 'horizontalBarStacked'
    | 'verticalBarNormalized'
    | 'horizontalBarNormalized'
    | 'numberCard'
    | 'gauge'
    | 'linearGauge'
    | 'area'
    | 'areaNormalized'
    | 'areaStacked'
    | 'line'
    | 'bubble'
    | 'heatMap'
    | 'treeMap'
    | 'polarRadar';

export interface DraymanNgxChartDataItem {
    name: string | number | Date;
    value: number;
    extra?: any;
    min?: number;
    max?: number;
}

export interface DraymanNgxChartBubbleDataItem {
    name: string | number | Date;
    x: number | Date;
    y: number | Date;
    r: number;
    extra?: any;
}

export interface DraymanNgxChartSeries {
    name: string | number;
    series: Array<DraymanNgxChartDataItem | DraymanNgxChartBubbleDataItem>;
}

export interface DraymanNgxCharts {
    /**
     * Executed when a chart data point is selected.
     */
    onSelect?: ElementEvent<{ data: any }>;
    /**
     * Executed when the pointer enters a chart data point.
     */
    onActivate?: ElementEvent<{ data: any }>;
    /**
     * Executed when the pointer leaves a chart data point.
     */
    onDeactivate?: ElementEvent<{ data: any }>;
    /**
     * Executed when a pie slice is double-clicked.
     */
    onDblClick?: ElementEvent<{ data: any }>;
    type: DraymanNgxChartType;
    /**
     * Chart data. Most charts accept either a single series of `{ name, value }`
     * items or a multi-series array of `{ name, series }` items. Bubble charts
     * use `{ name, x, y, r }` points. Linear gauges use `value` instead.
     */
    results?: any[];
    /**
     * Fixed chart dimensions `[width, height]`. When omitted, the chart fills
     * its parent container.
     */
    view?: [number, number];
    legendTitle?: string;
    /**
     * Color scheme of the chart.
     */
    scheme?: any;
    /**
     * Enable animations.
     */
    animations?: boolean;
    /**
     * Show or hide the legend.
     */
    legend?: boolean;
    /**
     * Show or hide pie labels.
     */
    labels?: boolean;
    customColors?: any;
    schemeType?: 'ordinal' | 'linear';
    explodeSlices?: boolean;
    doughnut?: boolean;
    arcWidth?: number;
    gradient?: boolean;
    activeEntries?: any[];
    tooltipDisabled?: boolean;
    tooltipText?: any;
    trimLabels?: boolean;
    maxLabelLength?: number;
    xAxis?: boolean;
    yAxis?: boolean;
    showXAxisLabel?: boolean;
    showYAxisLabel?: boolean;
    xAxisLabel?: string;
    yAxisLabel?: string;
    showGridLines?: boolean;
    trimXAxisTicks?: boolean;
    trimYAxisTicks?: boolean;
    rotateXAxisTicks?: boolean;
    maxXAxisTickLength?: number;
    maxYAxisTickLength?: number;
    xAxisTickFormatting?: any;
    yAxisTickFormatting?: any;
    axisTickFormatting?: any;
    xAxisTicks?: any[];
    yAxisTicks?: any[];
    barPadding?: number;
    groupPadding?: number;
    roundDomains?: boolean;
    roundEdges?: boolean;
    noBarWhenZero?: boolean;
    xScaleMax?: any;
    xScaleMin?: any;
    yScaleMax?: number;
    yScaleMin?: number;
    showDataLabel?: boolean;
    dataLabelFormatting?: any;
    cardColor?: string;
    bandColor?: string;
    emptyColor?: string;
    innerPadding?: number | number[];
    textColor?: string;
    legendPosition?: 'right' | 'below';
    min?: number;
    max?: number;
    units?: string;
    bigSegments?: number;
    smallSegments?: number;
    showAxis?: boolean;
    showText?: boolean;
    textValue?: string;
    margin?: number[];
    startAngle?: number;
    angleSpan?: number;
    timeline?: boolean;
    autoScale?: boolean;
    rangeFillOpacity?: number;
    showRefLines?: boolean;
    referenceLines?: any[];
    showRefLabels?: boolean;
    /**
     * Baseline used by the standard area chart.
     */
    baseValue?: number | 'auto';
    /**
     * Numeric value rendered by a linear gauge.
     */
    value?: number;
    /**
     * Comparison marker rendered by a linear gauge.
     */
    previousValue?: number;
    maxRadius?: number;
    minRadius?: number;
    label?: string;
    minWidth?: number;
    designatedTotal?: number;
    valueFormatting?: any;
    nameFormatting?: any;
    percentageFormatting?: any;
    labelFormatting?: any;
    showSeriesOnHover?: boolean;
    yAxisMinScale?: number;
    labelTrim?: boolean;
    labelTrimSize?: number;
}
