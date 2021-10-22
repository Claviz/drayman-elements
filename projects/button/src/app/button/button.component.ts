import { Component, Input, ViewEncapsulation } from '@angular/core';
import { DraymanButton } from 'projects/shared/models/button-options';

@Component({
  selector: 'drayman-button-internal',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {

  @Input() onClick?: () => Promise<void>;
  @Input() label?: string;
  @Input() view?: 'basic' | 'raised' | 'flat' | 'stroked' | 'icon' | 'fab' | 'miniFab' | 'unstyled';
  @Input() icon?: string;
  @Input() tooltip?: string;
  @Input() disabled?: boolean;
  @Input() imgUrl?: string;
  @Input() popup?: {
    text: string;
    style?: any;
  };
  @Input() buttonStyle?: any;

  emitClick($event: PointerEvent) {
    $event.stopPropagation();
    this.onClick();
  }
}
