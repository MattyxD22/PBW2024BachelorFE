import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { startOfWeek, subWeeks, addWeeks } from 'date-fns';
import { Subject } from 'rxjs';
import { CalendarEvent } from 'calendar-utils';
import { AddDaysPipe } from '../pipes/add-days.pipe';

@Component({
  selector: 'app-week-calendar',
  standalone: true,
  imports: [CommonModule, AddDaysPipe], 
  templateUrl: './week-calender.component.html',
  styleUrls: ['./week-calender.component.scss']
})
export class WeekCalenderComponent {
  viewDate: Date = startOfWeek(new Date());
  refresh = new Subject<void>();

  hours: number[] = Array.from({ length: 24 }, (_, i) => i);

  events: CalendarEvent[] = [
    {
      start: new Date(),
      end: new Date(),
      title: 'ArbejdsSession',
    },
  ];

  previousWeek(): void {
    this.viewDate = subWeeks(this.viewDate, 1);
    this.refresh.next();
  }

  nextWeek(): void {
    this.viewDate = addWeeks(this.viewDate, 1);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    console.log(action, event);
  }
}
