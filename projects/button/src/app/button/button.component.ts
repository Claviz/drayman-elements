// button.component.ts
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
  @Input() buttonIconStyle?: any;
  @Input() buttonRef?: any;

  constructor(private sanitizer: DomSanitizer) { }

  get safeLabelHtml(): SafeHtml {
    const raw = this.label ?? 'Button';
    return this.sanitizer.bypassSecurityTrustHtml(raw);
  }

  emitClick($event: PointerEvent) {
    if (this.onClick) {
      $event.stopPropagation();
      this.onClick();
    }
  }
}
