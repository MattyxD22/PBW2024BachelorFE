import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { TeamupStore } from '../../stores/teamup.store';

@Component({
  selector: 'app-full-calendar',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './full-calendar.component.html',
  styleUrls: ['./full-calendar.component.scss']
})
export class FullCalendarComponent implements OnInit {
  calendarVisible = signal(true);
  teamupStore = inject(TeamupStore);
  
  // Compute events from the store
  events = this.teamupStore.getUserCalendar()

  // FullCalendar options
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
    events: [] // Initialize with an empty array
  });

  get options() {
    return this.calendarOptions();
  }

  ngOnInit() {
    // Watch for changes in events and update the calendar accordingly
    this.events.subscribe(() => {
      console.log('plz');
      
      this.updateCalendarEvents();
    });
  }

  // Method to update calendar events
  private updateCalendarEvents() {
    const currentEvents = this.events();
    this.calendarOptions.set({ events: this.transformEvents(currentEvents) });
  }

  // Method to transform the event data
  private transformEvents(events: any[]): any[] {
    const transformedEvents: any[] = [];
    
    events.forEach(event => {
      if (event.rrule) {
        const instances = this.generateRecurringEvents(event);
        transformedEvents.push(...instances);
      } else {
        transformedEvents.push({
          id: event.id,
          title: event.title,
          start: event.start_dt,
          end: event.end_dt,
          allDay: event.all_day || false,
          extendedProps: {
            email: event.custom?.email || ''
          }
        });
      }
    });
    
    return transformedEvents;
  }

  // Method to parse RRule into days of the week and end date
  private parseRRule(rrule: string): { days: number[], until: Date | null } {
    const parts = rrule.split(';');
    const days: number[] = [];
    let until: Date | null = null;

    const dayMapping: { [key: string]: number } = {
      MO: 1, // Monday
      TU: 2, // Tuesday
      WE: 3, // Wednesday
      TH: 4, // Thursday
      FR: 5, // Friday
      SA: 6, // Saturday
      SU: 0  // Sunday
    };

    for (const part of parts) {
      const [key, value] = part.split('=');
      if (key === 'BYDAY') {
        value.split(',').forEach(day => {
          if (dayMapping[day]) {
            days.push(dayMapping[day]);
          }
        });
      } else if (key === 'UNTIL') {
        until = new Date(value);
      }
    }

    return { days, until };
  }

  // Method to generate recurring events based on the parsed RRule
  private generateRecurringEvents(event: any): any[] {
    const rrule = event.rrule;
    const startDate = new Date(event.start_dt);
    const endDate = new Date(event.end_dt);
    const { days, until } = this.parseRRule(rrule);

    const generatedEvents: any[] = [];
    let currentDate = new Date(startDate);

    while (!until || currentDate <= until) {
      // Check if the current date is one of the specified days
      if (days.includes(currentDate.getDay())) {
        // Create a copy of the event with updated start and end times
        const newEvent = { ...event };
        newEvent.start_dt = currentDate.toISOString();
        newEvent.end_dt = new Date(currentDate.getTime() + (endDate.getTime() - startDate.getTime())).toISOString();
        generatedEvents.push(newEvent);
      }
      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return generatedEvents;
  }
}
