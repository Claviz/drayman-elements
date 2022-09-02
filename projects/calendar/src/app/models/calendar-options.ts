export interface DraymanCalendar {
    /**
     * Array of events to be displayed in the calendar.
     */
    events?: { title: string; id: any; color: string; start: string; end?: string; }[];
    /**
     * Executed when user clicks on an event.
     */
    onEventClick?: ElementEvent<{ id: any }>;
    /**
     * Executed when user clicks on a day.
     */
    onDayClick?: ElementEvent<{ date: string }>;
}