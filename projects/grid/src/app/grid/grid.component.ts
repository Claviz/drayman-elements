import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgStyle } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ResizedEvent } from 'angular-resize-event';
import { merge, Subject } from 'rxjs';
import { debounce, debounceTime, throttleTime } from 'rxjs/operators';
import { GridContentButton, GridCell } from '../models/grid-options';
// import CustomStore from 'devextreme/data/custom_store';
// import { LoadOptions } from 'devextreme/data/load_options';

@Component({
  selector: 'drayman-grid-internal',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  @Input() scrollTo = ({ row }) => {
    this.scrollable.scrollTo({ top: row * this.cellHeight });
  };
  @Input() onLoad?: (options) => Promise<any>;
  @Input() onContentButtonClick?: (options) => Promise<any>;
  @Input() onCellClick?: (options) => Promise<any>;
  @ViewChild(CdkScrollable) scrollable: CdkScrollable;

  @Input() grid: GridCell[] = []

  @Input() onScroll: any;
  @Input() cellHeight: number;
  @Input() cellWidth: number;
  @Input() columnCount: number;
  @Input() rowCount: number;

  getCellStyle(cell: GridCell) {
    const rowEnd = cell.rowSpan ? cell.row + cell.rowSpan : cell.row + 1;
    const colEnd = cell.colSpan ? cell.col + cell.colSpan : cell.col + 1;
    return {
      ...cell.cellStyle,
      gridArea: `${cell.row + 1}/${cell.col + 1}/${rowEnd + 1}/${colEnd + 1}`,
    };
  }

  constructor(public elementRef: ElementRef) {
  }

  ngOnDestroy() {
  }

  // height: number;
  // width: number;
  resized$ = new Subject();

  emitCellClick(cell: GridCell) {
    this.onCellClick?.({ cell });
  }

  emitContentButtonClick(cell: GridCell, button: GridContentButton) {
    this.onContentButtonClick?.({ cell, button });
  }

  onResized(event: ResizedEvent) {
    if (event.oldHeight && event.oldWidth) {
      console.log('resize', event);
      this.resized$.next();
    }
  }
  ngAfterViewInit() {
    merge(
      this.scrollable.elementScrolled(),
      this.resized$,
    ).pipe(
      // debounceTime(500)
      debounceTime(50),
    ).subscribe((x) => {
      this.onScroll?.({
        currentCol: Math.floor(this.scrollable.measureScrollOffset('left') / this.cellWidth),
        visibleColCount: Math.ceil(this.scrollable.getElementRef().nativeElement.clientWidth / this.cellWidth),
        currentRow: Math.floor(this.scrollable.measureScrollOffset('top') / this.cellHeight),
        visibleRowCount: Math.ceil(this.scrollable.getElementRef().nativeElement.clientHeight / this.cellHeight),
      })
    });
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  get gridStyle() {
    return {
      gridTemplateColumns: `repeat(${this.columnCount}, ${this.cellWidth}px)`,
      gridTemplateRows: `repeat(${this.rowCount}, ${this.cellHeight}px)`,
      width: `${this.columnCount * this.cellWidth}px`,
      height: `${this.rowCount * this.cellHeight}px`,
      display: 'grid',
    }
  }

}