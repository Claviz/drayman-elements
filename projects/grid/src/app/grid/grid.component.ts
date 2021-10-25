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

  @Input() selectionMode?: {
    enabled: boolean;
    cellStyle?: any;
  };
  @Input() selectedCells?: GridCell[] = [];
  @Input() rowHoverStyle?: any;
  @Input() onSelectedCellsChange?: (options) => Promise<any>;
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

  resized$ = new Subject();
  _selectedCells: GridCell[] = [];
  pendingSelectedCells: GridCell[] = [];
  startSelectionCell: GridCell;
  hoveredRow: number = -1;

  getCellStyle(cell: GridCell) {
    const rowEnd = cell.rowSpan ? cell.row + cell.rowSpan : cell.row + 1;
    const colEnd = cell.colSpan ? cell.col + cell.colSpan : cell.col + 1;

    return {
      ...cell.cellStyle,
      ...(this.hoveredRow === cell.row ? this.rowHoverStyle : {}),
      ...([...this.pendingSelectedCells, ...this._selectedCells].find(x => x.row === cell.row && x.col === cell.col) ? this.selectionMode.cellStyle : {}),
      gridArea: `${cell.row + 1}/${cell.col + 1}/${rowEnd + 1}/${colEnd + 1}`,
    };
  }

  constructor(public elementRef: ElementRef) {
  }

  ngOnDestroy() {
  }

  emitCellClick(cell: GridCell) {
    if (this.selectionMode?.enabled) {
      if (!this.pendingSelectedCells.length) {
        const alreadySelected = this._selectedCells.find(x => x.row === cell.row && x.col === cell.col)
        if (alreadySelected) {
          this._selectedCells = this._selectedCells.filter(x => !(x.row === cell.row && x.col === cell.col));
          this.onSelectedCellsChange({ selectedCells: this._selectedCells });
        } else if (!cell.disableSelect && (!this._selectedCells.length || this._selectedCells[0].selectionGroup === cell.selectionGroup)) {
          this._selectedCells.push(cell);
          this.onSelectedCellsChange({ selectedCells: this._selectedCells });
        }
      }
    } else {
      this.onCellClick?.({ cell });
    }
  }

  onMouseLeave($event: MouseEvent, cell: GridCell) {
    this.hoveredRow = -1;
  }

  onMouseDown($event: MouseEvent, cell: GridCell) {
    if (this.selectionMode.enabled && !this._selectedCells.length || this._selectedCells[0].selectionGroup === cell.selectionGroup) {
      this.startSelectionCell = cell;
    }
  }

  onMouseUp($event: MouseEvent, cell: GridCell) {
    this.startSelectionCell = null;
    if (this.pendingSelectedCells.length) {
      this._selectedCells = [...this._selectedCells, ...this.pendingSelectedCells];
      this.pendingSelectedCells = [];
      this.onSelectedCellsChange({ selectedCells: this._selectedCells });
    }
  }

  onMouseOver($event: MouseEvent, cell: GridCell) {
    this.hoveredRow = cell.row;
    if (this.startSelectionCell) {
      const minCol = Math.min(cell.col, this.startSelectionCell.col);
      const maxCol = Math.max(cell.col, this.startSelectionCell.col);
      const minRow = Math.min(cell.row, this.startSelectionCell.row);
      const maxRow = Math.max(cell.row, this.startSelectionCell.row);
      this.pendingSelectedCells = this.grid.filter(x =>
        !x.disableSelect &&
        x.col >= minCol &&
        x.col <= maxCol &&
        x.row >= minRow &&
        x.row <= maxRow &&
        x.selectionGroup === this.startSelectionCell.selectionGroup
      );
    }
  }

  onGridMouseLeave($event: MouseEvent) {
    this.startSelectionCell = null;
    if (this.pendingSelectedCells.length) {
      this._selectedCells = [...this._selectedCells, ...this.pendingSelectedCells];
      this.pendingSelectedCells = [];
      this.onSelectedCellsChange({ selectedCells: this._selectedCells });
    }
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
    if (this.selectedCells) {
      this._selectedCells = [...this.selectedCells];
    }
  }

  get gridStyle() {
    return {
      gridTemplateColumns: `repeat(${this.columnCount}, ${this.cellWidth}px)`,
      gridTemplateRows: `repeat(${this.rowCount}, ${this.cellHeight}px)`,
      width: `${this.columnCount * this.cellWidth}px`,
      height: `${this.rowCount * this.cellHeight}px`,
      display: 'grid',
      userSelect: 'none'
    }
  }

}