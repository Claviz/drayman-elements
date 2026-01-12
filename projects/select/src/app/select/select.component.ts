import { Component, Input, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import type { MatOptionSelectionChange, MatPseudoCheckboxState } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { FieldBase } from '../../../../../projects/shared/components/field-base';
import { DraymanSelect } from '../models/select-options';

@Component({
  selector: 'drayman-select-internal',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent extends FieldBase<any> {

  @Input() metaData?: any;
  @Input() options?: {
    value: any;
    label: string;
  }[];
  @Input() onSearchChange?: (data: { value: string }) => Promise<void>;
  @Input() multiple?: boolean;
  @Input() selectAllOption?: boolean;
  @Input() value?: any;
  @Input() label?: string;
  @Input() disabled?: boolean;
  @Input() placeholder?: string;
  @Input() helpText?: string;
  @Input() error?: string;
  @Input() onValueChange?: ElementEvent<{ value: any }>;
  @Input() updateOnBlur?: boolean;
  @Input() allowSelectionClear?: boolean;
  @Input() appearance: string;

  searchControl: FormControl;
  searchChanges$: Subscription;
  selectOptions: { value: any; label: any }[] = [];
  searching = false;
  selectAllLabel = 'Select all';
  deselectAllLabel = 'Deselect all';
  readonly selectAllOptionValue = '__drayman_select_all__';

  ngOnChanges(simpleChanges: SimpleChanges) {
    super.ngOnChanges(simpleChanges);
    if (this.value) {
      const missingValues = this.getMissingValues(
        this.options,
        Array.isArray(this.value) ? this.value : [this.value]
      );
      this.options = [...missingValues.map(x => ({ value: x, label: x })), ...this.options];
    }
    const options = this.options || [];
    this.selectOptions = this.onSearchChange ?
      options :
      options.filter(x => `${x.label}`.trim().toLowerCase().includes(this.searchControl?.value?.toLowerCase() || ''));
  }

  clearSelection($event) {
    $event.stopPropagation();
    this.formControl.setValue(undefined);
  }

  handleSelectAllSelectionChange(event: MatOptionSelectionChange) {
    if (!event.isUserInput || !event.source.selected) {
      return;
    }
    event.source.deselect();
    if (this.formControl.disabled) {
      return;
    }
    const visibleValues = this.getVisibleValues();
    if (!visibleValues.length) {
      return;
    }
    const selectedValues = this.getSelectedValues();
    const allVisibleSelected = visibleValues.every(value => selectedValues.includes(value));
    if (allVisibleSelected) {
      const remainingValues = selectedValues.filter(value => !visibleValues.includes(value));
      this.formControl.setValue(remainingValues.length ? remainingValues : undefined);
      return;
    }
    const nextValues = [...selectedValues, ...visibleValues.filter(value => !selectedValues.includes(value))];
    this.formControl.setValue(nextValues);
  }

  get selectAllState(): MatPseudoCheckboxState {
    const visibleValues = this.getVisibleValues();
    if (!visibleValues.length) {
      return 'unchecked';
    }
    const selectedValues = this.getSelectedValues();
    let selectedCount = 0;
    for (const optionValue of visibleValues) {
      if (selectedValues.some(value => value === optionValue)) {
        selectedCount += 1;
      }
    }
    if (selectedCount === 0) {
      return 'unchecked';
    }
    if (selectedCount === visibleValues.length) {
      return 'checked';
    }
    return 'indeterminate';
  }

  get selectAllDisplayLabel(): string {
    return this.selectAllState === 'checked' ? this.deselectAllLabel : this.selectAllLabel;
  }

  private getSelectedValues(): any[] {
    const currentValue = this.formControl.value;
    if (Array.isArray(currentValue)) {
      return currentValue.filter(value => value !== this.selectAllOptionValue);
    }
    if (currentValue === this.selectAllOptionValue) {
      return [];
    }
    return currentValue != null ? [currentValue] : [];
  }

  private getVisibleValues(): any[] {
    return this.selectOptions.map(option => option.value);
  }

  ngOnInit() {
    super.ngOnInit();
    this.searchControl = new FormControl('');
    this.searchChanges$ = this.searchControl.valueChanges.pipe(
      debounceTime(500),
    ).subscribe((value) => this.search(value));
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.searchChanges$) {
      this.searchChanges$.unsubscribe();
    }
  }

  search(value: string = '') {
    if (this.onSearchChange) {
      this.searching = true;
      this.onSearchChange({ value }).finally(() => this.searching = false);
    } else {
      value = value.toLowerCase();
      this.selectOptions = this.options?.filter(x => x.label.trim().toLowerCase().includes(value));
    }
  }

  getMissingValues(options: { value: any; label: any }[], missingCandidates: any[]) {
    const missingValues = [];
    if (options) {
      for (const candidate of missingCandidates) {
        if (candidate && !options.find(x => x.value === candidate)) {
          missingValues.push(candidate);
        }
      }
    }
    return missingValues;
  }

  trackByFn(index, item) {
    return item.value;
  }

}
