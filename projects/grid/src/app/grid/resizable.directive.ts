import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appResizable]'
})
export class ResizableDirective {

    @Input() enableResize: boolean;

    private startX: number;
    private startWidth: number;

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }

    @Output() resize: EventEmitter<number> = new EventEmitter();

    @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent) {
        if (!this.enableResize) {
            return;
        }

        this.startX = event.clientX;
        this.startWidth = this.el.nativeElement.parentElement.offsetWidth;

        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mouseup', this.onMouseUp);
    }


    onMouseMove(event: MouseEvent) {
        const newWidth = this.startWidth + (event.clientX - this.startX);
        this.resize.emit(newWidth);
    }

    onMouseUp() {
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);
    }

}
