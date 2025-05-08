export interface DraymanYearCalendar {
    /**
     * Executed when user clicks on a day.
     */
    onDayClick?: ElementEvent<{ date: string }>;
    /**
     * Array of selected dates in YYYY-MM-DD format.
     */
    selectedDates?: string[];
    /**
     * The year to display.
     * If not provided, the current year will be used.
     */
    year?: number;
}