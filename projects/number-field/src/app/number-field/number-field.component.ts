import { Component, Input, ViewChild } from '@angular/core';
import { MatInput } from '@angular/material/input';
import { AutocompleteFieldBase } from 'projects/shared/components/autocomplete-field-base';
import { FieldBase } from 'projects/shared/components/field-base';
import { generate } from 'shortid';

import { DraymanNumberField } from '../models/number-field-options';

@Component({
    selector: 'drayman-number-field-internal',
    templateUrl: './number-field.component.html',
    styleUrls: ['./number-field.component.scss']
})
export class NumberFieldComponent extends AutocompleteFieldBase<number> {
    @ViewChild(MatInput) input: MatInput;

    @Input() suggestions?: {
        value: any;
        label: string;
    }[];
    @Input() onFocus?: () => Promise<void>;
    @Input() appearance?: 'legacy' | 'standard' | 'fill' | 'outline';
    @Input() suggestionsPanelWidth?: string | number;
    @Input() value?: number;
    @Input() label?: string;
    @Input() disabled?: boolean;
    @Input() placeholder?: string;
    @Input() helpText?: string;
    @Input() error?: string;
    @Input() onValueChange?: ElementEvent<{ value: number }>;
    @Input() updateOnBlur?: boolean;
    id = generate();
}

