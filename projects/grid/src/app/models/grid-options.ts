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
    grid: GridCell[];
    onScroll?: ElementEvent<{
        currentCol: number;
        visibleColCount: number;
        currentRow: number;
        visibleRowCount: number;
    }>;
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
    }>;
}

export interface GridCell {
    row: number;
    col: number;
    rowSpan?: number;
    colSpan?: number;
    content: (
        { type: 'text', value: string, style?: any } |
        { type: 'button', value: GridContentButton, style?: any }
    )[];
    cellStyle?: any;
    contentStyle?: any;
    selectionGroup?: string;
    disableSelect?: boolean;
    selectionCellStyle?: any;
    ref?: string;
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
    buttonStyle?: any;
}