export interface ButtonOptionsBase {
    /**
     * Caption inside button.
     * `Button` by default.
     */
    label?: string;
    /**
     * Material style of the button.
     * `basic` by default.
     */
    view?: 'basic' | 'raised' | 'flat' | 'stroked' | 'icon' | 'fab' | 'miniFab' | 'unstyled';
    /**
     * Name of the [Material icon](https://material.io/resources/icons) printed inside button.
     */
    icon?: string;
    /**
     * Tooltip shown on hover.
     */
    tooltip?: string;
    /**
     * Wether button should be disabled.
     */
    disabled?: boolean;
    /**
     * Image shown on hover.
     */
    imgUrl?: string;
    buttonStyle?: any;
    buttonIconStyle?: any;
    popup?: {
        text: string;
        style?: any;
    };
    /**
     * Reference to the button.
     */
    buttonRef?: string;
}