import { Component, signal } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { EventService } from '../event-all/event-all.component';

interface CalendarEvent {
  title: string;
  start: string;
  end: string;
}

@Component({
  selector: 'app-full-calendar',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './full-calendar.component.html',
  styleUrls: ['./full-calendar.component.scss']
})

export class FullCalendarComponent {
  calendarVisible = signal(true);
  currentEvents = signal<CalendarEvent[]>([]); // Hold events

  constructor(private eventService: EventService) {
    // Directly bind events in the calendarOptions
    this.visArbejdstimer();
  }

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
    businessHours: {
      daysOfWeek: [1, 2, 3, 4, 5],
      startTime: '5:00',
      endTime: '21:00',
    },
    views: {
      dayGridMonth: {
        titleFormat: { year: 'numeric', month: '2-digit', day: '2-digit' },
      },
      timeGridWeek: {
        slotMinTime: '05:00:00',
        slotMaxTime: '21:00:00',
        slotDuration: '00:30:00',
      },
    },
    events: [] // Start with an empty events array
  });

  // Update the calendar options with the current events
  private updateCalendarOptions() {
    this.calendarOptions.set({
      ...this.calendarOptions(),
      events: this.currentEvents(), // Bind events dynamically
    });
  }

  visArbejdstimer() {
    this.currentEvents.set(this.eventService.getArbejdstimerEvents());
    this.updateCalendarOptions(); // Update options after changing events
    console.log('Arbejdstimer events:', this.currentEvents());
  }

  visFridage() {
    this.currentEvents.set(this.eventService.getFridageEvents());
    this.updateCalendarOptions(); // Update options after changing events
    console.log('Fridage events:', this.currentEvents());
  }

  get options() {
    return this.calendarOptions();
  }
}
