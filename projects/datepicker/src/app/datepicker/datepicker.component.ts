import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatInput } from '@angular/material/input';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as utc from 'dayjs/plugin/utc';
import { DatePickerDirective, IDatePickerConfig } from 'ng2-date-picker';
import { FieldBase } from 'projects/shared/components/field-base';
import { generate } from 'shortid';

import { DraymanDatepicker } from '../models/datepicker-options';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

@Component({
  selector: 'drayman-datepicker-internal',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent extends FieldBase<string> implements OnChanges {
  @ViewChild(MatInput) input: MatInput;
  @ViewChild('dateDirectivePicker') datePickerDirective: DatePickerDirective;

  @Input() monthPicker?: boolean;
  @Input() dateFormat?: string;
  @Input() showTodayButton?: boolean;
  @Input() appearance?: 'legacy' | 'standard' | 'fill' | 'outline';
  @Input() value?: string;
  @Input() label?: string;
  @Input() disabled?: boolean;
  @Input() placeholder?: string;
  @Input() helpText?: string;
  @Input() error?: string;
  @Input() onValueChange?: ElementEvent<{ value: string }>;
  @Input() updateOnBlur?: boolean;
  @Input() allowedDates?: string[] = [];
  @Input() minDate?: string;
  @Input() maxDate?: string;
  @Input() moveCalendarTo?= ({ date }) => {
    this.datePickerDirective.api.moveCalendarTo(date);
  }

  opened = false;
  defaultDateFormat = 'YYYY-MM-DD';
  mask;
  config: IDatePickerConfig = {
    openOnClick: false,
    openOnFocus: false,
    format: this.defaultDateFormat,
    appendTo: '.drayman-elements-container',
    firstDayOfWeek: 'mo',
    isDayDisabledCallback: (date) => {
      return !this.isDateAllowed(date.format(`YYYY-MM-DD`));
    }
  };
  id = generate();

  isDateAllowed(date: string) {
    if (this.minDate && dayjs(date, `YYYY-MM-DD`).diff(dayjs(this.minDate, `YYYY-MM-DD`)) < 0) {
      return false;
    }
    if (this.maxDate && dayjs(this.maxDate, `YYYY-MM-DD`).diff(dayjs(date, `YYYY-MM-DD`)) < 0) {
      return false;
    }
    if (!this.allowedDates.length) {
      return true;
    }
    if (this.allowedDates.includes(date)) {
      return true;
    }
    return false;
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    // todo: remove when fix will be available
    this.updateOnBlur = false;
    this.dateFormat = this.dateFormat || this.defaultDateFormat;
    if (this.config.format !== this.dateFormat) {
      this.config = {
        ...this.config,
        format: this.dateFormat,
      };
    }
    if (this.value) {
      this.value = dayjs.utc(this.value).format(this.config.format);
    }
    const format = this.config.format;
    this.mask = format?.length === 10 && ['YYYY', 'MM', 'DD'].every(x => format.includes(x)) ?
      format.replace('YYYY', '0000').replace('MM', 'M0').replace('DD', 'd0') : null;
    this.datePickerDirective?.api?.moveCalendarTo?.(this.value);
    super.ngOnChanges(simpleChanges);
  }

  setTodayDate() {
    this.formControl.setValue(dayjs.utc().format(this.config.format));
  }

  modifyValueBeforeChange(value) {
    return this.getISOString(value);
  }

  shouldValueChange(value) {
    if (this.value === value) {
      return false;
    }
    if (!value) {
      return true;
    }
    try {
      this.getISOString(value);
    } catch (err) {
      return false;
    }
    return this.isDateAllowed(dayjs(value).format(`YYYY-MM-DD`));
  }

  toggleOpen() {
    this.opened ? this.datePickerDirective.api.close() : this.datePickerDirective.api.open();
  }

  getISOString(value) {
    if (!value) {
      return null;
    }
    return dayjs(value, this.config.format, 'en', true).utc(true).startOf('day').toISOString();
  }

}

