import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgStyle } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
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
import { MatMenuTrigger } from '@angular/material/menu';
// import CustomStore from 'devextreme/data/custom_store';
// import { LoadOptions } from 'devextreme/data/load_options';

@Component({
  selector: 'drayman-grid-internal',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger: MatMenuTrigger;
  @ViewChild('container') containerRef: ElementRef;
  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (this.scrollDirection === 'horizontal') {
      event.preventDefault();
      const container = this.containerRef.nativeElement as HTMLDivElement;
      container.scrollLeft += event.deltaY;
    }
  }

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
  @Input() onContextMenuItemClick?: (options) => Promise<any>;
  @Input() onColumnWidthChange?: (options) => Promise<any>;
  @ViewChild(CdkScrollable) scrollable: CdkScrollable;

  @Input() grid: GridCell[] = []

  @Input() scrollDirection: 'vertical' | 'horizontal' = 'vertical';
  @Input() gridRef: any;
  @Input() onScroll: any;
  @Input() cellHeight?: number;
  @Input() cellWidth?: number;
  @Input() columnWidths?: number[];
  @Input() columnCount: number;
  @Input() rowCount: number;
  @Input() scrollbarWidth: 'narrow' | 'medium' | 'wide' = 'narrow';

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
  menuTopLeftPosition = { x: '0', y: '0' }

  get scrollbarWidthClass() {
    if (this.scrollbarWidth === 'narrow') {
      return null;
    }

    return `scrollbar-${this.scrollbarWidth}`;
  }

  cellTrackByFn(index, cell: GridCell) {
    return cell.row + '-' + cell.col;
  }

  cellItemTrackByFn(cell: GridCell, index, item) {
    return cell.row + '-' + cell.col + '-' + index;
  }

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
    } else {
      if (cell.contextMenuItems?.length) {
        $event.preventDefault();
        this.menuTopLeftPosition.x = $event.clientX + 'px';
        this.menuTopLeftPosition.y = $event.clientY + 'px';
        this.matMenuTrigger.menuData = { items: cell.contextMenuItems.map(x => ({ label: x, cell })) }
        this.matMenuTrigger.openMenu();
      }
    }
  }

  emitContextMenuItemClick($event: PointerEvent, item: { label: string; cell: GridCell; }) {
    this.onContextMenuItemClick?.(item);
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
        currentCol: this.getCurrentColumn(this.scrollable.measureScrollOffset('left')),
        visibleColCount: this.getVisibleColumnCount(
          this.scrollable.getElementRef().nativeElement.clientWidth,
          this.getCurrentColumn(this.scrollable.measureScrollOffset('left')),
          this.scrollable.measureScrollOffset('left')
        ),
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

  getCurrentColumn(scrollOffset) {
    if (this.columnWidths && this.columnWidths.length > 0) {
      let accumulatedWidth = 0;
      for (let i = 0; i < this.columnWidths.length; i++) {
        accumulatedWidth += this.columnWidths[i];
        if (scrollOffset < accumulatedWidth) {
          return i;
        }
      }
      return this.columnWidths.length - 1;
    }
    return this.cellWidth ? Math.floor(scrollOffset / this.cellWidth) : 0;
  }

  getVisibleColumnCount(clientWidth, startingCol, scrollOffset) {
    if (this.columnWidths && this.columnWidths.length > 0) {
      let accumulatedWidth = 0;
      for (let i = 0; i < startingCol; i++) {
        accumulatedWidth += this.columnWidths[i];
      }
      let remainingWidthInStartingCol = Math.max(0, (accumulatedWidth + this.columnWidths[startingCol]) - scrollOffset);
      let adjustedClientWidth = clientWidth - remainingWidthInStartingCol;
      let colCount = remainingWidthInStartingCol > 0 ? 1 : 0;
      for (let i = startingCol + 1; i < this.columnWidths.length && adjustedClientWidth > 0; i++) {
        adjustedClientWidth -= this.columnWidths[i];
        colCount++;
      }
      return colCount;
    }
    return this.cellWidth ? Math.ceil(clientWidth / this.cellWidth) : this.columnCount;
  }


  onResize(newWidth: number, index: number) {
    if (this.columnWidths) {
      // index = this.getCurrentColumn(this.scrollable.measureScrollOffset('left')) + index;
      this.columnWidths = [...this.columnWidths.slice(0, index), newWidth, ...this.columnWidths.slice(index + 1)];
      this.onColumnWidthChange?.({ columnWidths: this.columnWidths, changedWidthIndex: index, });
    }
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
    const gridTemplateColumns = this.columnWidths
      ? this.columnWidths.map(width => `${width}px`).join(' ')
      : `repeat(${this.columnCount}, ${this.cellWidth ? `${this.cellWidth}px` : 'auto'})`;
    return {
      gridTemplateColumns: gridTemplateColumns,
      gridTemplateRows: `repeat(${this.rowCount}, ${this.cellHeight ? `${this.cellHeight}px` : 'auto'})`,
      width: this.columnWidths
        ? `${this.columnWidths.reduce((acc, width) => acc + width, 0)}px`
        : (this.cellWidth ? `${this.columnCount * this.cellWidth}px` : `100%`),
      height: height ? `${height}px` : `100%`,
      display: 'grid',
      userSelect: 'none'
    };
  }


}