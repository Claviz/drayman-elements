import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'drayman-year-calendar-internal',
  templateUrl: './year-calendar.component.html',
  styleUrls: ['./year-calendar.component.scss']
})
export class YearCalendarComponent implements OnInit {

  @Input() year: number = new Date().getFullYear();
  @Input() selectedDates: string[] = [];
  @Input() onDayClick?: (data: { date: string; }) => Promise<void>;
  @Input() setSelectedDates = ({ selectedDates }) => {
    this.selectedDates = selectedDates;
    this.generateCalendar();
  };

  daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  months: MonthGrid[] = [];

  ngOnInit() {
    this.generateCalendar();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.year) {
      this.generateCalendar();
    }
  }

  private generateCalendar() {
    this.months = [];

    for (let m = 0; m < 12; m++) {
      const first = new Date(this.year, m, 1);
      const monthName = first.toLocaleString('default', { month: 'long' });
      const daysInMonth = new Date(this.year, m + 1, 0).getDate();
      const offset = (first.getDay() + 6) % 7; 

      const weeks: DayCell[][] = [];
      let week: DayCell[] = [];
      let dayNum = 1;

      for (let i = 0; i < 42; i++) {
        const inMonth = i >= offset && dayNum <= daysInMonth;
        let date = '';
        let label = '';
        let selected = false;

        if (inMonth) {
          const dd = String(dayNum).padStart(2, '0');
          const mm = String(m + 1).padStart(2, '0');
          date = `${this.year}-${mm}-${dd}`;
          label = `${dayNum}`;
          selected = this.selectedDates.includes(date);
          dayNum++;
        }

        week.push({ date, label, inMonth, selected });

        if (week.length === 7) {
          weeks.push(week);
          week = [];
        }
      }

      this.months.push({ name: monthName, weeks });
    }
  }

  onCellClick(cell: DayCell) {
    if (!cell.inMonth) return;
    const idx = this.selectedDates.indexOf(cell.date);
    if (idx > -1) {
      this.selectedDates.splice(idx, 1);
      cell.selected = false;
    } else {
      this.selectedDates.push(cell.date);
      cell.selected = true;
    }
    this.onDayClick?.({ date: cell.date });
  }
}

interface DayCell {
  date: string;
  label: string;
  inMonth: boolean;
  selected: boolean;
}

interface MonthGrid {
  name: string;
  weeks: DayCell[][];
}
