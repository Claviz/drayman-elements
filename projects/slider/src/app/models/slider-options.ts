import { FieldOptionsBase } from '../../../../shared/models/field-options-base';

export interface DraymanSlider extends FieldOptionsBase<boolean> {
    /**
    * @ignore
    */
    placeholder?: never;
    /**
    * @ignore
    */
    helpText?: never;
    /**
    * @ignore
    */
    error?: never;

    /**
     * Whether to show the value of the slider on the thumb.
     */
    enableThumbLabel?: boolean;
    /**
     * The interval between ticks.
     */
    tickInterval?: number;
    /**
     * The minimum value of the slider.
     */
    min?: number;
    /**
     * The maximum value of the slider.
     */
    max?: number;
    /**
     * The step value of the slider.
     */
    step?: number;
    /**
     * The color of the slider
     */
    color?: string;
    /**
     * Whether to always show the value on the thumb.
     */
    alwaysOnThumb?: boolean;
}
