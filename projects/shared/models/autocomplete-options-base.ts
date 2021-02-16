import { SelectOption } from "../../../projects/select/src/app/models/select-options";
import { InputFieldOptionsBase } from "./input-field-options-base";

export interface AutocompleteOptionsBase<T> extends InputFieldOptionsBase<T> {
    /**
     * Autocomplete suggestions.
     */
    suggestions?: SelectOption[];
    /**
     * Executed when autocomplete field is focused.
     */
    onFocus?: () => Promise<void>;
}