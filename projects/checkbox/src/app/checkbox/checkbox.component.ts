import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FieldBase } from '../../../../shared/components/field-base';
import { generate } from 'shortid';

@Component({
  selector: 'drayman-checkbox-internal',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent extends FieldBase<boolean> implements OnChanges {

  @Input() metaData?: any;
  @Input() onValueChange?: (data: { value: boolean; }) => Promise<void>;
  @Input() value?: boolean;
  @Input() label?: string;
  @Input() disabled?: boolean;
  @Input() placeholder?: string;
  @Input() helpText?: string;
  @Input() error?: string;
  @Input() updateOnBlur?: boolean;
  id = generate();

  //todo: remove when fix will be available
  ngOnChanges(simpleChanges: SimpleChanges) {
    this.updateOnBlur = false;
    super.ngOnChanges(simpleChanges);
  }
}
