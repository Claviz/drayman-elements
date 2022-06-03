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
import { DomSanitizer } from '@angular/platform-browser';
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
    similarGroupCellStyle?: any;
    otherGroupCellStyle?: any;
  };
  @Input() selectedCells?: GridCell[] = [];
  @Input() rowHoverStyle?: any;
  @Input() onSelectedCellsChange?: (options) => Promise<any>;
  @Input() scrollTo = ({ row }) => {
    if (this.cellHeight) {
      this.scrollable.scrollTo({ top: row * this.cellHeight });
    }
  };
  @Input() onLoad?: (options) => Promise<any>;
  @Input() onContentButtonClick?: (options) => Promise<any>;
  @Input() onCellClick?: (options) => Promise<any>;
  @ViewChild(CdkScrollable) scrollable: CdkScrollable;

  @Input() grid: GridCell[] = []

  @Input() gridRef: any;
  @Input() onScroll: any;
  @Input() cellHeight?: number;
  @Input() cellWidth?: number;
  @Input() columnCount: number;
  @Input() rowCount: number;

  resized$ = new Subject();
  selectedCellsChanged$ = new Subject<{
    selectedCells: GridCell[];
    clearPrevious: boolean;
  }>();
  _selectedCells: GridCell[] = [];
  pendingSelectedCells: GridCell[] = [];
  startSelectionCell: GridCell;
  hoveredRow: number = -1;
  ctrl;

  getCellStyle(cell: GridCell) {
    const rowEnd = cell.rowSpan ? cell.row + cell.rowSpan : cell.row + 1;
    const colEnd = cell.colSpan ? cell.col + cell.colSpan : cell.col + 1;

    return {
      ...cell.cellStyle,
      ...(this.hoveredRow === cell.row ? this.rowHoverStyle : {}),
      ...(
        [...this.pendingSelectedCells, ...this._selectedCells].find(x => x.selectionGroup === cell.selectionGroup) ?
          { ...this.selectionMode?.similarGroupCellStyle, } : {}
      ),
      ...(
        [...this.pendingSelectedCells, ...this._selectedCells].length && !([...this.pendingSelectedCells, ...this._selectedCells].find(x => x.selectionGroup === cell.selectionGroup)) ?
          { ...this.selectionMode?.otherGroupCellStyle, } : {}
      ),
      ...(
        [...this.pendingSelectedCells, ...this._selectedCells].find(x => x.row === cell.row && x.col === cell.col) ?
          { ...this.selectionMode?.cellStyle, ...cell.selectionCellStyle } : {}
      ),
      gridArea: `${cell.row + 1}/${cell.col + 1}/${rowEnd + 1}/${colEnd + 1}`,
    };
  }

  constructor(public elementRef: ElementRef, private sanitizer: DomSanitizer) {
  }

  ngOnDestroy() {
  }

  getSanitizedString(value: string) {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

  oncontextmenu($event: PointerEvent, cell: GridCell) {
    if ($event.ctrlKey) {
      $event.preventDefault();
      this.emitCellClick($event, cell, true);
    }
  }

  emitCellClick($event: PointerEvent, cell: GridCell, ctrl = false) {
    if ($event.ctrlKey) {
      $event.preventDefault();
      ctrl = true;
    }
    if (this.selectionMode?.enabled) {
      if (!this.pendingSelectedCells.length) {
        if (ctrl) {
          this._selectedCells = [cell];
          this.selectedCellsChanged$.next({ selectedCells: this._selectedCells, clearPrevious: true })
        } else {
          const alreadySelected = this._selectedCells.find(x => x.row === cell.row && x.col === cell.col)
          if (alreadySelected) {
            this._selectedCells = this._selectedCells.filter(x => !(x.row === cell.row && x.col === cell.col));
            this.selectedCellsChanged$.next({ selectedCells: this._selectedCells, clearPrevious: false });
          } else if (!cell.disableSelect && (!this._selectedCells.length || this._selectedCells[0]?.selectionGroup === cell.selectionGroup)) {
            this._selectedCells.push(cell);
            this.selectedCellsChanged$.next({ selectedCells: this._selectedCells, clearPrevious: false });
          }
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
    if (this.selectionMode?.enabled && !this._selectedCells.length || this._selectedCells[0]?.selectionGroup === cell.selectionGroup) {
      this.ctrl = $event.ctrlKey;
      this.startSelectionCell = cell;
    }
  }

  onMouseUp($event: MouseEvent, cell: GridCell) {
    this.startSelectionCell = null;
    if (this.pendingSelectedCells.length) {
      this._selectedCells = [...(this.ctrl ? [] : this._selectedCells), ...this.pendingSelectedCells];
      this.pendingSelectedCells = [];
      this.selectedCellsChanged$.next({ selectedCells: this._selectedCells, clearPrevious: !!this.ctrl });
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
        x.selectionGroup === this.startSelectionCell?.selectionGroup
      );
    }
  }

  onGridMouseLeave($event: MouseEvent) {
    this.startSelectionCell = null;
    if (this.pendingSelectedCells.length) {
      this._selectedCells = [...this._selectedCells, ...this.pendingSelectedCells];
      this.pendingSelectedCells = [];
      this.selectedCellsChanged$.next({ selectedCells: this._selectedCells, clearPrevious: false });
    }
  }

  emitContentButtonClick(cell: GridCell, button: GridContentButton) {
    this.onContentButtonClick?.({ cell, button });
  }

  onResized(event: ResizedEvent) {
    if (event.oldHeight && event.oldWidth) {
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
        currentCol: this.cellWidth ? Math.floor(this.scrollable.measureScrollOffset('left') / this.cellWidth) : 0,
        visibleColCount: this.cellWidth ? Math.ceil(this.scrollable.getElementRef().nativeElement.clientWidth / this.cellWidth) : this.columnCount,
        currentRow: this.cellHeight ? Math.floor(this.scrollable.measureScrollOffset('top') / this.cellHeight) : 0,
        visibleRowCount: this.cellHeight ? Math.ceil(this.scrollable.getElementRef().nativeElement.clientHeight / this.cellHeight) : this.rowCount,
      })
    });
    this.selectedCellsChanged$.pipe(
      debounceTime(250),
    ).subscribe((x) => {
      this.onSelectedCellsChange?.({
        ...x,
        selectedCells: x.selectedCells.filter(
          (xx, i) => x.selectedCells.findIndex(y => y.row === xx.row && y.col === xx.col) === i
        ),
      });
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
    const height = (this.cellHeight || 0) * (this.rowCount || 0);
    return {
      gridTemplateColumns: `repeat(${this.columnCount}, ${this.cellWidth ? `${this.cellWidth}px` : `auto`})`,
      gridTemplateRows: `repeat(${this.rowCount}, ${this.cellHeight ? `${this.cellHeight}px` : `autor`})`,
      width: this.cellWidth ? `${this.columnCount * this.cellWidth}px` : `100%`,
      height: height ? `${height}px` : `100%`,
      display: 'grid',
      userSelect: 'none'
    }
  }

}