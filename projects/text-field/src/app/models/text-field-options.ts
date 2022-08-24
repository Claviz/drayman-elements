import { InputMaskOptionsBase } from '../../../../shared/models/input-mask-options-base';
import { AutocompleteOptionsBase } from '../../../../shared/models/autocomplete-options-base';
import { InputFieldOptionsBase } from '../../../../shared/models/input-field-options-base';

export interface DraymanTextField extends InputFieldOptionsBase<string>, AutocompleteOptionsBase<string>, InputMaskOptionsBase {
    type?: 'text' | 'password';
    /**
     * Executed with current value when ENTER key is pressed or an option from suggestions is selected.
     */
    onEnter?: ElementEvent<{ value: string }>;
    /**
     * Input will be focused on appearance if set to `true`.
     */
    focused?: boolean;
}
