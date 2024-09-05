import { Component, ElementRef, Input, AfterViewInit, OnDestroy, OnChanges } from '@angular/core';

@Component({
    selector: 'drayman-sparkline-internal',
    templateUrl: './sparkline.component.html',
    styleUrls: ['./sparkline.component.scss']
})
export class SparklineComponent implements AfterViewInit, OnDestroy, OnChanges {

    @Input() data: { value: number, tooltip?: any }[] = [];
    @Input() lineColor: string = '#7b7a78';
    @Input() maxPointColor: string = '#23B08B';
    @Input() minPointColor: string = '#F87050';

    viewBoxWidth = 100;
    viewBoxHeight = 20;
    padding = 6;

    maxPoints: { x: number, y: number, tooltip?: any }[] = [];
    minPoints: { x: number, y: number, tooltip?: any }[] = [];

    private resizeObserver: ResizeObserver;

    constructor(private elementRef: ElementRef) { }

    ngAfterViewInit(): void {
        this.resizeObserver = new ResizeObserver(() => {
            this.recalculateViewBox();
        });
        this.resizeObserver.observe(this.elementRef.nativeElement.parentElement.parentElement.parentElement);
        this.recalculateViewBox();
    }

    ngOnDestroy(): void {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    }

    ngOnChanges(): void {
        this.recalculateViewBox();
    }

    recalculateViewBox(): void {
        const parentElement = this.elementRef.nativeElement.parentElement.parentElement.parentElement;
        const parentWidth = parentElement.offsetWidth;
        const parentHeight = parentElement.offsetHeight;
        this.viewBoxWidth = parentWidth - 2 * this.padding;
        this.viewBoxHeight = parentHeight - 2 * this.padding;
        this.calculateExtremePoints();
    }

    calculateExtremePoints(): void {
        if (!this.data.length) return;

        const maxValue = Math.max(...this.data.map(x => x.value));
        const minValue = Math.min(...this.data.map(x => x.value));
        const allEqual = this.data.every(value => value.value === maxValue);

        this.maxPoints = [];
        this.minPoints = [];

        if (this.data.length === 1) {
            const x = this.viewBoxWidth / 2 + this.padding;
            const y = this.viewBoxHeight / 2 + this.padding;
            this.maxPoints = [{ x, y, tooltip: this.data[0].tooltip }];
        } else if (allEqual) {
            const startX = this.padding;
            const endX = this.viewBoxWidth + this.padding;
            const y = this.viewBoxHeight / 2 + this.padding;
            this.data.forEach((_, index) => {
                const x = this.data.length > 1 ? startX + (index / (this.data.length - 1)) * (endX - startX) : startX;
                this.maxPoints.push({ x, y, tooltip: _.tooltip });
            });
        } else {
            const range = maxValue - minValue || 1;
            this.data.forEach((value, index) => {
                const x = this.data.length > 1 ? this.padding + (index / (this.data.length - 1)) * this.viewBoxWidth : this.padding;
                const y = this.padding + this.viewBoxHeight - ((value.value - minValue) / range * this.viewBoxHeight);
                if (value.value === maxValue) {
                    this.maxPoints.push({ x, y, tooltip: value.tooltip });
                }
                if (value.value === minValue) {
                    this.minPoints.push({ x, y, tooltip: value.tooltip });
                }
            });
        }
    }

    getPath(): string {
        if (this.data.length === 1) {
            return '';
        }

        const allEqual = this.data.every(value => value.value === this.data[0].value);
        if (allEqual) {
            const startX = this.padding;
            const endX = this.viewBoxWidth + this.padding;
            const y = this.viewBoxHeight / 2 + this.padding;
            return `M${startX},${y} L${endX},${y}`;
        }

        const maxValue = Math.max(...this.data.map(x => x.value));
        const minValue = Math.min(...this.data.map(x => x.value));
        const range = maxValue - minValue || 1;

        const points = this.data.map((value, index) => {
            const x = this.padding + (index / (this.data.length - 1)) * this.viewBoxWidth;
            const y = this.padding + this.viewBoxHeight - ((value.value - minValue) / range * this.viewBoxHeight);
            return `${x},${y}`;
        });

        return `M${points.join(' ')}`;
    }
}