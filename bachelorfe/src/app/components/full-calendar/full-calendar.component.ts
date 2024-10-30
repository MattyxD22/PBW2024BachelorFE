import { Component, signal } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';


@Component({
  selector: 'app-full-calendar',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './full-calendar.component.html',
  styleUrls: ['./full-calendar.component.scss']
})
export class FullCalendarComponent {
  calendarVisible = signal(true);
  calendarOptions = signal<CalendarOptions>({
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin
    ],
    locale: 'da',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    initialView: 'timeGridWeek',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    expandRows: true,
    firstDay: 1, 
    eventBackgroundColor: 'PrimaryColor',
    views: {
      dayGridMonth: {
        titleFormat: { year: 'numeric', month: '2-digit', day: '2-digit' }, 
      },
      timeGridWeek: {
        slotMinTime: '05:00:00', 
        slotMaxTime: '21:00:00',
        slotDuration: '00:30:00', 
      }
    },
  });

  get options() {
    return this.calendarOptions();
  }
}
