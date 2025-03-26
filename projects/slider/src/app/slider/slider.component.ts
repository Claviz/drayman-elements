import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FieldBase } from '../../../../shared/components/field-base';
import { generate } from 'shortid';

@Component({
  selector: 'drayman-slider-internal',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent extends FieldBase<number> implements OnChanges {

  @Input() metaData?: any;
  @Input() onValueChange?: (data: { value: number; }) => Promise<void>;
  @Input() value?: number;
  @Input() label?: string;
  @Input() disabled?: boolean;
  @Input() placeholder?: string;
  @Input() helpText?: string;
  @Input() error?: string;
  @Input() updateOnBlur?: boolean;

  @Input() enableThumbLabel?: boolean;
  @Input() tickInterval?: number;
  @Input() min?: number;
  @Input() max?: number;
  @Input() step?: number;
  @Input() color?: string;
  @Input() alwaysOnThumb?: boolean;

  id = generate();

  //todo: remove when fix will be available
  ngOnChanges(simpleChanges: SimpleChanges) {
    this.updateOnBlur = false;
    super.ngOnChanges(simpleChanges);
  }
}
