export interface DraymanGrid {
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
    cellHeight: number;
    cellWidth: number;
    columnCount: number;
    rowCount: number;
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