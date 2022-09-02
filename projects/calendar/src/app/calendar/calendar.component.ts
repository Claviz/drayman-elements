import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as utc from 'dayjs/plugin/utc';
import * as tinycolor from 'tinycolor2';

dayjs.extend(utc);
dayjs.extend(customParseFormat);


@Component({
  selector: 'drayman-calendar-internal',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnChanges, AfterViewInit {

  @Input() events?: { title: string; id: string; color: string; start: string; end?: string; }[] = [];
  @Input() onEventClick?: (data: { id: any; }) => Promise<void>;
  @Input() onDayClick?: (data: { date: string; }) => Promise<void>;

  view: CalendarView = CalendarView.Month;
  viewDate = new Date();
  activeDayIsOpen: boolean = false;
  calendarEvents: CalendarEvent[] = [];

  eventClicked({ event }: { event: CalendarEvent }): void {
    this.onEventClick?.({ id: event.id });
  }

  dayClicked({ day, events }: { day: any; events: CalendarEvent[] }): void {
    this.onDayClick?.({ date: this.getISOString(day.date) });
  }

  viewDateChange(date: Date) {
  }

  getISOString(value) {
    if (!value) {
      return null;
    }
    return dayjs(value).utc(true).startOf('day').toISOString();
  }

  constructor() {
  }

  ngAfterViewInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.calendarEvents = this.events?.map((event) => {
      return {
        title: event.title,
        color: {
          primary: tinycolor(event.color).toRgbString(),
          secondary: tinycolor(event.color).setAlpha(0.3).toRgbString(),
        },
        start: dayjs(event.start).toDate(),
        end: dayjs(event.end).toDate(),
        id: event.id,
      };
    });

  }
}
