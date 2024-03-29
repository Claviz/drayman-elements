import { FieldOptionsBase } from '../../../../shared/models/field-options-base';

export interface DraymanSelect extends FieldOptionsBase<any> {
    /**
     * Array of options that populate the select menu.
     */
    options?: {
        value: any;
        label: string;
    }[];
    /**
     * This function can be used to override default selection search algorithm.
     * Accepts value of the search input. Can be `null`.
     * If this function is not defined, options will be filtered client-side. 
     */
    onSearchChange?: ElementEvent<{
        /**
         * Value of the search input.
         */
        value: string
    }>;
    /**
     * Whether the user should be allowed to select multiple options.
     */
    multiple?: boolean;
    /**
     * Whether clearing of the select field should be disabled.
     */
    allowSelectionClear?: boolean;
}