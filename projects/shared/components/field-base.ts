import { OnChanges, OnInit, SimpleChanges, OnDestroy, Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, filter, map, tap } from 'rxjs/operators';
import { FieldOptionsBase } from '../models/field-options-base';

@Injectable()
export class FieldBase<T> implements OnChanges, OnDestroy, OnInit {

    options: FieldOptionsBase<T>;
    errorStateMatcher: ErrorStateMatcher = { isErrorState: () => !!this.options?.error || (!this.valueCanBeChanged && this.formControl.dirty) };
    formControl = new FormControl('');
    private valueChanges$: Subscription;
    private debouncing = false;
    private debounce = 500;
    private pendingRequests = 0;
    private valueCanBeChanged = false;

    constructor() { }

    ngOnInit() {
        this.valueChanges$ = this.formControl.valueChanges.pipe(
            filter((value) => {
                this.valueCanBeChanged = this.shouldValueChange(value);
                return this.valueCanBeChanged;
            }),
            tap(() => {
                if (!this.debouncing && this.options?.onValueChangeStart) {
                    this.options.onValueChangeStart();
                }
                this.debouncing = true;
            }),
            debounceTime(this.debounce),
        ).subscribe((value) => {
            if (!this.options?.updateOnBlur) {
                this.onValueChange(value);
            }
        });
    }

    onValueChange(value) {
        if (this.options?.onValueChange) {
            this.debouncing = false;
            this.pendingRequests++;
            this.options
                .onValueChange({ value: this.modifyValueBeforeChange(value) })
                .then(() => this.pendingRequests--);
        }
    }

    onBlur() {
        if (this.options?.updateOnBlur && this.shouldValueChange(this.formControl.value)) {
            this.onValueChange(this.formControl.value);
        }
    }

    ngOnChanges() {
        this.options?.disabled ? this.formControl.disable({ emitEvent: false }) : this.formControl.enable({ emitEvent: false });
        if (!this.debouncing && this.pendingRequests === 0) {
            this.formControl.setValue(this.options?.value, { emitEvent: false });
        }
    }

    modifyValueBeforeChange(value: any): T {
        return value;
    }

    shouldValueChange(value: any): boolean {
        return true;
    }

    ngOnDestroy() {
        if (this.valueChanges$) {
            this.valueChanges$.unsubscribe();
        }
    }

}
