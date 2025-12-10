export interface DraymanGrid {
    rowHoverStyle?: any;
    onLoad?: ElementEvent<{
        currentCol: number;
        visibleColCount: number;
        currentRow: number;
        visibleRowCount: number;
    }>;
    onContentButtonClick?: ElementEvent<{
        cell: GridCell;
    }>;
    onCellClick?: ElementEvent<{
        cell: GridCell;
        button: GridContentButton;
    }>;
    onContextMenuItemClick?: ElementEvent<{
        cell: GridCell;
        label: string;
    }>;
    grid: GridCell[];
    onScroll?: ElementEvent<{
        currentCol: number;
        visibleColCount: number;
        currentRow: number;
        visibleRowCount: number;
    }>;
    scrollDirection?: 'vertical' | 'horizontal';
    /**
     * Height of the cell. If not specified, cell height will automatically be calculated to fit a grid.
     */
    cellHeight?: number;
    /**
     * Width of the cell. If not specified, cell width will automatically be calculated to fit a grid.
     */
    cellWidth?: number;
    columnCount: number;
    rowCount: number;
    selectionMode?: {
        enabled: boolean;
        cellStyle?: any;
    };
    selectedCells?: GridCell[];
    onSelectedCellsChange?: ElementEvent<{
        selectedCells: GridCell[];
        clearPrevious: boolean;
    }>;
    gridRef?: string;
    /**
     * Width of the scrollbar. Default is narrow - 8px.
     * Medium is 12px and wide is 16px.
     */
    scrollbarWidth?: 'narrow' | 'medium' | 'wide';
    /**
     * Width of each column.
     */
    columnWidths?: number[];
    /**
     * Index of the column that has been resized.
     */
    changedWidthIndex?: ElementEvent<{
        columnWidths: number[];
        changedColumnWidthIndex: number;
    }>;
    gridStyle?: any;
    /**
     * Minimum width of any column on resize. Default is 10px.
     */
    minColumnWidth?: number;
    /**
     * Style of the container that holds the grid.
     */
    containerStyle?: any;
}

export interface GridCell {
    overlay?: string;
    overlayContainerStyle?: string;
    overlayInnerStyle?: string;
    row: number;
    col: number;
    rowSpan?: number;
    colSpan?: number;
    content: (
        { type: 'text', value: string, style?: any, hoverStyle?: any, tooltip?: string, } |
        { type: 'button', value: GridContentButton, style?: any, hoverStyle?: any }
    )[];
    cellStyle?: any;
    contentStyle?: any;
    selectionGroup?: string;
    disableSelect?: boolean;
    selectionCellStyle?: any;
    ref?: string;
    contextMenuItems?: string[];
}

export interface GridContentButton {
    /**
     * Material style of the button.
     * `basic` by default.
     */
    view?: 'basic' | 'raised' | 'flat' | 'stroked' | 'icon' | 'fab' | 'miniFab';
    /**
     * Name of the [Material icon](https://material.io/resources/icons) printed inside button.
     */
    icon?: string;
    /**
     * Tooltip shown on hover.
     */
    tooltip?: string;
    /**
     * Wether button should be disabled.
     */
    disabled?: boolean;
    /**
     * Image shown on hover.
     */
    imgUrl?: string;
    /**
     * Reference to the button.
     */
    buttonRef?: string;
    buttonStyle?: any;
}