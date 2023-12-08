export interface DraymanGauge {
    /**
     * Specifies the gauge's type.
     */
    type?: 'full' | 'semi' | 'arch';

    /**
     * Specifies the minimum numeric value for gauge's scale.
     */
    min?: number;

    /**
     * Specifies the maximum numeric value for gauge's scale.
     */
    max?: number;

    /**
     * Specifies the current value of the Gauge in the range specified by min and max.
     */
    value: number;

    /**
     * The style of line ending at the gauge's end.
     */
    cap?: 'round' | 'butt';

    /**
     * Specifies the thickness of the gauge's bar.
     */
    thick?: number;

    /**
     * Specifies the text to display below the Gauge's reading.
     */
    label?: string;

    /**
     * Specifies the foreground color of the Gauge's bar.
     */
    foregroundColor?: string;

    /**
     * Specifies the background color of the Gauge's bar.
     */
    backgroundColor?: string;

    /**
     * Specifies a string appended to the Gauge's reading.
     */
    append?: string;

    /**
     * Specifies a string prepended to the Gauge's reading.
     */
    prepend?: string;

    /**
     * Specifies the duration (in milliseconds) of the Gauge's animation.
     */
    duration?: number;

    /**
     * Specifies an object of threshold values at which the gauge's color changes.
     */
    thresholds?: { [key: number]: { color: string; bgOpacity?: number; } };

    /**
     * Specifies an object of marker values at which value to place a marker.
     */
    markers?: { [key: number]: { color: string; type: 'line' | 'triangle'; size: number; label?: string; font?: string; } };

    /**
     * Specifies an optional margin for the chart.
     */
    margin?: number;

    /**
     * Toggles the gauge animation.
     */
    animate?: boolean;

    /**
     * Specifies the text to display inside the Gauge's bar instead of the value.
     */
    valueLabel?: string;

    /**
     * Specifies the style of the text to display inside the Gauge's bar.
     */
    valueStyle?: any;
}
