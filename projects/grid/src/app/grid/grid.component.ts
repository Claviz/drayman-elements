import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ResizedEvent } from 'angular-resize-event';
import { animationFrameScheduler, fromEvent, merge, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, skipWhile, throttleTime } from 'rxjs/operators';
import { GridContentButton, GridCell } from '../models/grid-options';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'drayman-grid-internal',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger: MatMenuTrigger;
  @ViewChild('container') containerRef: ElementRef<HTMLElement>;

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
    if (this._cellHeight) {
      const el = this.containerRef.nativeElement;
      el.scrollTo({ top: row * this._cellHeight });
    }
  };
  @Input() onLoad?: (options) => Promise<any>;
  @Input() onContentButtonClick?: (options) => Promise<any>;
  @Input() onContentValueChange?: (options) => Promise<any>;
  @Input() onCellClick?: (options) => Promise<any>;
  @Input() onContextMenuItemClick?: (options) => Promise<any>;
  @Input() onColumnWidthChange?: (options) => Promise<any>;
  @Input() grid: GridCell[] = []
  @Input() scrollDirection: 'vertical' | 'horizontal' = 'vertical';
  @Input() gridRef: any;
  @Input() onScroll: any;
  @Input() cellHeight?: number;
  @Input() cellWidth?: number;
  @Input() columnWidths?: number[];
  @Input() columnCount: number;
  @Input() minColumnWidth?: number;
  @Input() rowCount: number;
  @Input() gridStyle?: any;
  @Input() containerStyle?: any = {};
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
  hoveredCells = new Set<string>();
  ctrl;
  menuTopLeftPosition = { x: '0', y: '0' };
  selectedCellChangeSubscription: Subscription;
  isUserDraggingScrollbar = false;
  firstRow = 0;
  firstCol = 0;
  buffer = 5;
  visibleRowCount = 0;
  visibleColCount = 0;
  visibleCells: GridCell[] = [];
  visibleContainerStyle: any = {};
  visibleGridStyle: any = {};
  stickyCells: GridCell[] = [];
  nonStickyCells: GridCell[] = [];
  stickyContainerStyle: any = {};
  cellMatrix: GridCell[][] = [];
  colPrefix: number[] = [];
  scrollSub: Subscription;
  nativeScrollSubscription: Subscription;
  cellItemCache = new WeakMap<any, { sanitized: SafeHtml, parsedValue: string }>();

  get _cellHeight(): number {
    if (this.cellHeight != null) return this.cellHeight;
    const h = this.containerRef?.nativeElement?.clientHeight;
    return (h != null && this.rowCount > 0) ? h / this.rowCount : 0;
  }

  get _cellWidth(): number {
    if (this.cellWidth != null) return this.cellWidth;
    const w = this.containerRef?.nativeElement?.clientWidth;
    return (w != null && this.columnCount > 0) ? w / this.columnCount : 0;
  }

  onNativeScroll() {
    const el = this.containerRef.nativeElement;
    const scrollTop = el.scrollTop;
    const scrollLeft = el.scrollLeft;
    this.updateVisibleWindow(scrollTop, scrollLeft);
  }

  updateVisibleWindow(scrollTop: number, scrollLeft: number) {
    const vh = this.containerRef.nativeElement.clientHeight;
    const vw = this.containerRef.nativeElement.clientWidth;

    if (!this.columnWidths?.length) {
      this.colPrefix = Array(this.columnCount + 1)
        .fill(0)
        .map((_, i) => i * this._cellWidth!);
    }

    const rawFirstRow = Math.floor(scrollTop / this._cellHeight!);
    this.firstRow = Math.max(0, rawFirstRow - this.buffer);
    const rowsInView = Math.ceil(vh / this._cellHeight!) + 2 * this.buffer;
    this.visibleRowCount = Math.min(this.rowCount, rowsInView);
    const maxFirstRow = Math.max(0, this.rowCount - this.visibleRowCount);
    this.firstRow = Math.min(this.firstRow, maxFirstRow);

    const totalCols = this.columnCount;
    const { first, last } = this.computeColRange(scrollLeft, vw);
    const visibleCols = last - first + 1;
    const maxFirstCol = Math.max(0, totalCols - visibleCols);

    this.firstCol = Math.min(first, maxFirstCol);
    this.visibleColCount = visibleCols;

    const minR = this.firstRow;
    const maxR = minR + this.visibleRowCount - 1;
    const minC = this.firstCol;
    const maxC = minC + this.visibleColCount - 1;

    const cells: GridCell[] = [];
    for (let r = this.firstRow; r <= maxR; r++) {
      for (let c = this.firstCol; c <= maxC; c++) {
        const cell = this.cellMatrix[r][c];
        if (cell) cells.push(cell);
      }
    }
    this.visibleCells = cells;

    const topPx = this.firstRow * this._cellHeight!;
    const leftPx = this.colPrefix[this.firstCol];
    const heightPx = this.visibleRowCount * this._cellHeight!;
    const widthPx = this.colPrefix[this.firstCol + this.visibleColCount] - this.colPrefix[this.firstCol];

    this.visibleContainerStyle = {
      position: 'absolute',
      transform: `translate3d(${leftPx}px, ${topPx}px, 0)`,
      width: `${widthPx}px`,
      height: `${heightPx}px`,
      willChange: 'transform',
    };

    this.visibleGridStyle = {
      display: 'grid',
      gridTemplateRows: `repeat(${this.visibleRowCount}, ${this._cellHeight}px)`,
      gridTemplateColumns: this.columnWidths
        ? this.columnWidths
          .slice(this.firstCol, this.firstCol + this.visibleColCount)
          .map(w => `${w}px`).join(' ')
        : `repeat(${this.visibleColCount}, ${this._cellWidth}px)`,
      width: '100%',
      height: '100%',
      ...(this.gridStyle || {})
    };
    this.updateStickyContainer(scrollTop, scrollLeft);
  }

  updateStickyContainer(scrollTop: number, scrollLeft: number) {
    this.stickyContainerStyle = {
      position: 'absolute',
      width: `${this.spacerWidth}px`,
      height: `${this.spacerHeight}px`,
      willChange: 'transform',
      zIndex: 3,
    };
  }

  getStickyCellStyle(cell: GridCell, scrollTop: number, scrollLeft: number) {
    const base = this.getCellStyle(cell);
    const style: any = { ...base };

    if (cell.cellStyle?.sticky === 'top' || cell.cellStyle?.sticky === 'top-left') {
      style.top = '0';
      style.position = 'sticky';
      style.zIndex = 5;
    }

    if (cell.cellStyle?.sticky === 'left' || cell.cellStyle?.sticky === 'top-left') {
      style.left = '0';
      style.position = 'sticky';
      style.zIndex = 5;
    }

    if (cell.cellStyle?.sticky === 'left' || cell.cellStyle?.sticky === 'top-left') {
      style.transform = `translate3d(${scrollLeft}px, 0, 0)`;
      style.willChange = 'transform';
    }

    return style;
  }

  getVirtualCellStyle(cell: GridCell) {
    const base = this.getCellStyle(cell);

    let r = cell.row - this.firstRow;
    let c = cell.col - this.firstCol;
    if (cell.cellStyle?.position === 'sticky') {
      if (cell.row < this.firstRow) r = 0;
      if (cell.col < this.firstCol) c = 0;
    }

    const rowSpan = cell.rowSpan || 1;
    const colSpan = cell.colSpan || 1;
    const area = `${r + 1}/${c + 1}/${r + 1 + rowSpan}/${c + 1 + colSpan}`;

    return {
      ...base,
      gridArea: area
    };
  }


  get spacerWidth(): number {
    if (this.columnWidths && this.columnWidths.length) {
      return this.columnWidths.reduce((sum, w) => sum + w, 0);
    }
    return (this.columnCount * (this._cellWidth ?? 0));
  }

  get spacerHeight(): number {
    return (this.rowCount * (this._cellHeight ?? 0));
  }

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

  isCellHovered(cell: GridCell) {
    return this.hoveredCells.has(this.getCellKey(cell));
  }

  getCellItemStyle(cell: GridCell, cellItem: any) {
    return (this.isCellHovered(cell) && cellItem.hoverStyle) ? cellItem.hoverStyle : cellItem.style;
  }

  private getCellKey(cell: GridCell) {
    return `${cell.row}-${cell.col}`;
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

  constructor(public elementRef: ElementRef, private sanitizer: DomSanitizer, private ngZone: NgZone) {
  }

  ngOnDestroy() {
    if (this.selectedCellChangeSubscription) {
      this.selectedCellChangeSubscription.unsubscribe();
    }
    if (this.scrollSub) {
      this.scrollSub.unsubscribe();
    }
    if (this.nativeScrollSubscription) {
      this.nativeScrollSubscription.unsubscribe();
    }
  }

  getSanitized(cellItem: any): SafeHtml {
    return this.cellItemCache.get(cellItem)?.sanitized;
  }

  getParsedValue(cellItem: any): string {
    return this.cellItemCache.get(cellItem)?.parsedValue;
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
    const tgt = $event.target as HTMLElement;
    if (
      tgt.closest('input, textarea, select, button') ||
      tgt.closest('drayman-text-field-internal, drayman-checkbox-internal, drayman-button-internal, drayman-select-internal, drayman-datepicker-internal')
    ) {
      return;
    }
    if (!(tgt.closest('.selectable'))) {
      return;
    }
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
    this.hoveredCells.delete(this.getCellKey(cell));
    this.hoveredRow = -1;
  }

  onMouseDown($event: MouseEvent, cell: GridCell) {
    if (!(($event.target as HTMLElement).closest('.selectable'))) {
      return;
    }
    if (this.selectionMode?.enabled && !this._selectedCells.length || this._selectedCells[0]?.selectionGroup === cell.selectionGroup) {
      this.ctrl = $event.ctrlKey;
      this.startSelectionCell = cell;
    }
  }

  onMouseUp($event: MouseEvent, cell: GridCell) {
    if (!this.pendingSelectedCells.length && !($event.target as HTMLElement).closest('.selectable')) {
      return;
    }
    this.startSelectionCell = null;
    if (this.pendingSelectedCells.length) {
      this._selectedCells = [...(this.ctrl ? [] : this._selectedCells), ...this.pendingSelectedCells];
      this.pendingSelectedCells = [];
      this.selectedCellsChanged$.next({ selectedCells: this._selectedCells, clearPrevious: !!this.ctrl });
    }
  }

  onMouseOver($event: MouseEvent, cell: GridCell) {
    this.hoveredCells.add(this.getCellKey(cell));
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
    this.hoveredCells.clear();
    this.hoveredRow = -1;
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
    const scrollEl = this.containerRef.nativeElement as HTMLElement;
    scrollEl.scrollTop = 0;
    scrollEl.scrollLeft = 0;
    const scroll$ = new Observable<UIEvent>(observer => {
      const opts = { passive: true } as AddEventListenerOptions;
      const handler = (e: UIEvent) => observer.next(e);
      scrollEl.addEventListener('scroll', handler, opts);
      return () => scrollEl.removeEventListener('scroll', handler, opts);
    }).pipe(
      throttleTime(0, animationFrameScheduler),
    );
    this.ngZone.runOutsideAngular(() => {
      this.nativeScrollSubscription = scroll$.subscribe(() => {
        const top = scrollEl.scrollTop;
        const left = scrollEl.scrollLeft;
        this.ngZone.run(() => this.updateVisibleWindow(top, left));
      });
    });
    this.scrollSub = merge(
      scroll$.pipe(debounceTime(200)),
      this.resized$.pipe(debounceTime(200)),
    ).subscribe(() => {
      const top = scrollEl.scrollTop;
      const left = scrollEl.scrollLeft;
      this.onScroll?.({
        currentCol: this.getCurrentColumn(left),
        visibleColCount: this.getVisibleColumnCount(scrollEl.clientWidth, this.getCurrentColumn(left), left),
        currentRow: this._cellHeight ? Math.floor(top / this._cellHeight) : 0,
        visibleRowCount: this._cellHeight ? Math.ceil(scrollEl.clientHeight / this._cellHeight) : this.rowCount,
      });
    });
    this.selectedCellChangeSubscription = this.selectedCellsChanged$
      .pipe(
        debounceTime(50)
      )
      .subscribe(change => {
        this.onSelectedCellsChange?.({
          selectedCells: change.selectedCells,
          clearPrevious: change.clearPrevious
        });
      });
    const initTop = scrollEl.scrollTop;
    const initLeft = scrollEl.scrollLeft;
    this.onLoad?.({
      currentCol: this.getCurrentColumn(initLeft),
      visibleColCount: this.getVisibleColumnCount(
        scrollEl.clientWidth,
        this.getCurrentColumn(initLeft),
        initLeft
      ),
      currentRow: this._cellHeight
        ? Math.floor(initTop / this._cellHeight)
        : 0,
      visibleRowCount: this._cellHeight
        ? Math.ceil(scrollEl.clientHeight / this._cellHeight)
        : this.rowCount,
    });
    this.updateVisibleWindow(initTop, initLeft);
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
    return this._cellWidth ? Math.floor(scrollOffset / this._cellWidth) : 0;
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
    return this._cellWidth ? Math.ceil(clientWidth / this._cellWidth) : this.columnCount;
  }

  private computeColRange(scrollLeft: number, clientWidth: number) {
    const total = this.columnCount;
    const avgW = this.colPrefix[total] / total;
    const bufPx = this.buffer * avgW;
    const start = Math.max(0, scrollLeft - bufPx);
    const end = scrollLeft + clientWidth + bufPx;

    const first = this.binarySearchGE(this.colPrefix, start);
    const last = this.binarySearchGE(this.colPrefix, end);

    return {
      first: Math.min(first, total - 1),
      last: Math.min(last, total - 1)
    };
  }

  private binarySearchGE(arr: number[], v: number) {
    let lo = 0, hi = arr.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (arr[mid] < v) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  onResize(newWidth: number, colIndex: number) {
    const minWidth = this.minColumnWidth || 10;
    if (newWidth <= minWidth) {
      newWidth = minWidth;
    }
    if (!this.columnWidths) { return; }
    this.columnWidths = [
      ...this.columnWidths.slice(0, colIndex),
      newWidth,
      ...this.columnWidths.slice(colIndex + 1),
    ];
    this.onColumnWidthChange?.({
      columnWidths: this.columnWidths,
      changedWidthIndex: colIndex,
    });

    const el = this.containerRef.nativeElement;
    this.updateVisibleWindow(el.scrollTop, el.scrollLeft);
  }


  ngOnInit() {
  }

  onCellContentValueChange = ({ metaData, value }) => {
    const [row, col] = metaData.split('_').map(x => parseInt(x));
    const cell = this.grid.find(x => x.row === row && x.col === col);
    this.onContentValueChange?.({ cell, value });
  }

  ngOnChanges(changes: SimpleChanges) {
    let shouldRecalc = false;

    if (changes.grid && JSON.stringify(changes.grid?.previousValue || {}) !== JSON.stringify(changes.grid?.currentValue || {})) {
      this.stickyCells = this.grid.filter(c => c.cellStyle?.position === 'sticky');
      this.nonStickyCells = this.grid.filter(c => c.cellStyle?.position !== 'sticky');

      this.cellMatrix = Array.from(
        { length: this.rowCount },
        () => Array(this.columnCount)
      );
      for (let c of this.nonStickyCells) {
        this.cellMatrix[c.row][c.col] = c;
      }

      const parser = new DOMParser();
      this.grid.forEach(c => {
        c.content.forEach(item => {
          const itemAny = item as any;
          this.cellItemCache.set(itemAny, {
            parsedValue: parser.parseFromString(itemAny.value, 'text/html').body.textContent || '',
            sanitized: this.sanitizer.bypassSecurityTrustHtml(itemAny.value) || '',
          });
        });
      });

      this.pendingSelectedCells = [];
      shouldRecalc = true;
    }

    if (changes.columnWidths && JSON.stringify(changes.columnWidths?.previousValue || {}) !== JSON.stringify(changes.columnWidths?.currentValue || {})) {
      this.colPrefix = this.columnWidths!.reduce(
        (acc, w) => { acc.push(acc[acc.length - 1] + w); return acc; },
        [0]
      );
      shouldRecalc = true;
    }

    if (changes.selectedCells && JSON.stringify(this._selectedCells || {}) !== JSON.stringify(this.selectedCells || {})) {
      this._selectedCells = [...(this.selectedCells || [])];
      this.pendingSelectedCells = [];
      shouldRecalc = true;
    }

    if (shouldRecalc && this.containerRef?.nativeElement) {
      const el = this.containerRef.nativeElement;
      this.updateVisibleWindow(el.scrollTop, el.scrollLeft);
    }
  }

  get customGridStyle() {
    const height = (this._cellHeight || 0) * (this.rowCount || 0);
    const gridTemplateColumns = this.columnWidths
      ? this.columnWidths.map(width => `${width}px`).join(' ')
      : `repeat(${this.columnCount}, ${this._cellWidth ? `${this._cellWidth}px` : 'auto'})`;
    return {
      gridTemplateColumns: gridTemplateColumns,
      gridTemplateRows: `repeat(${this.rowCount}, ${this._cellHeight ? `${this._cellHeight}px` : 'auto'})`,
      width: this.columnWidths
        ? `${this.columnWidths.reduce((acc, width) => acc + width, 0)}px`
        : (this._cellWidth ? `${this.columnCount * this._cellWidth}px` : `100%`),
      height: height ? `${height}px` : `100%`,
      display: 'grid',
      ...(this.gridStyle || {}),
    };
  }

}
