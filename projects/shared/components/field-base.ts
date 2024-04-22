import { OnChanges, OnInit, SimpleChanges, OnDestroy, Injectable, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, filter, map, tap } from 'rxjs/operators';
import { FieldOptionsBase } from '../models/field-options-base';

@Injectable()
export class FieldBase<T> implements OnChanges, OnDestroy, OnInit {

    input: MatInput;
    metaData?: any;
    errorStateMatcher: ErrorStateMatcher = { isErrorState: () => !!this.error || (!this.valueCanBeChanged && this.formControl.dirty) };
    formControl = new FormControl('');
    error?;
    value?;
    // onValueChangeStart?;
    onValueChange?;
    onEnter?;
    updateOnBlur?;
    disabled?;
    onEnter$: Subject<void> = new Subject();
    private valueChanges$: Subscription;
    // private debouncing = false;
    // private debounce = 500;
    // private pendingRequests = 0;
    private valueCanBeChanged = false;
    // private formValue;

    constructor() { }

    ngOnInit() {
        this.onEnter$.pipe(
            debounceTime(100),
        ).subscribe(() => {
            if (this.shouldValueChange(this.formControl.value)) {
                this.onEnter?.({ value: this.modifyValueBeforeChange(this.formControl.value) })
            }
        });
        this.valueChanges$ = this.formControl.valueChanges.pipe(
            filter((value) => {
                this.valueCanBeChanged = this.shouldValueChange(value);
                return this.valueCanBeChanged;
                // let optionsValue = this.value || null;
                // this.formValue = value || null;
                // return optionsValue !== this.formValue && this.valueCanBeChanged;
            }),
            // tap(() => {
            //     if (!this.debouncing && this.onValueChangeStart) {
            //         this.onValueChangeStart();
            //     }
            //     this.debouncing = true;
            // }),
            // debounceTime(this.debounce),
        ).subscribe((value) => {
            if (!this.updateOnBlur) {
                this.triggerValueChange(value);
            }
        });
    }

    triggerValueChange(value) {
        if (this.onValueChange) {
            // this.debouncing = false;
            // this.pendingRequests++;
            this.onValueChange({ value: this.modifyValueBeforeChange(value), metaData: this.metaData })
            // .then(() => this.pendingRequests--);
        }
    }

    onEnterKeydown($event: KeyboardEvent) {
        this.onEnter$.next();
    }

    onBlur() {
        if (this.updateOnBlur && this.shouldValueChange(this.formControl.value)) {
            this.triggerValueChange(this.formControl.value);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        this.disabled ? this.formControl.disable({ emitEvent: false }) : this.formControl.enable({ emitEvent: false });
        // if (!this.debouncing && this.pendingRequests === 0) {
        if (changes.value && !this.input?.focused) {
            this.formControl.setValue(this.value, { emitEvent: false });
        }
        // }
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
        if (this.onEnter$) {
            this.onEnter$.unsubscribe();
        }
    }

}
