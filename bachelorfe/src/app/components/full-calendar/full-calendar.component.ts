import { Component, inject, signal, effect } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { EventService } from '../event-all/event-all.component';
import { TeamupStore } from '../../stores/teamup.store';
import { ClickupStore } from '../../stores/clickup.store';
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
  styleUrls: ['./full-calendar.component.scss'],
})
export class FullCalendarComponent {
  calendarVisible = signal(true);
  currentEvents = signal<CalendarEvent[]>([]);

  teamupStore = inject(TeamupStore);
  clickupStore = inject(ClickupStore);

  // Get events from the store
  readonly events = this.teamupStore.getUserCalendar;
  readonly subCalenders = this.teamupStore.getSubcalendars();

  // FullCalendar options
  calendarOptions = signal<CalendarOptions>({
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin],
    locale: 'da',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
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
    events: [], // Initialize with an empty array
    eventContent: (arg) => {
      const { event } = arg;
      const { extendedProps } = event;

      // Example: Display task details if available
      const title = event.title || 'Event';
      const taskDetails = extendedProps['taskDetails'];

      // You can customize the display as needed
      return {
        html: `
          <div class="border-b">
            <strong>${title}</strong>
            ${taskDetails ? `<div>${taskDetails.title}</div>` : ''}
            ${
              taskDetails
                ? `<div>${taskDetails.duration.hours}h ${taskDetails.duration.minutes}m</div>`
                : ''
            }
          </div>
        `,
      };
    },
  });

  private updateCalendarOptions() {
    this.calendarOptions.set({
      ...this.calendarOptions(),
      events: this.currentEvents(),
    });
  }

  visArbejdstimer() {
    const currentEvents = this.events();
    this.updateCalendarEvents(currentEvents, false);
    // this.currentEvents.set(this.eventService.getArbejdstimerEvents());
    // this.updateCalendarOptions();
    // console.log('Arbejdstimer events:', this.currentEvents());
  }

  visFridage() {


    const currentEvents = this.events();
    this.updateCalendarEvents(currentEvents, true);

    // this.currentEvents.set(this.eventService.getFridageEvents());
    // this.updateCalendarOptions();
    // console.log('Fridage events:', this.currentEvents());
  }

  get options() {
    return this.calendarOptions();
  }

  // Use `effect` to update calendar events when `events` changes
  private eventsEffect = effect(
    () => {
      const currentEvents = this.events();
      this.updateCalendarEvents(currentEvents, false);
    },
    { allowSignalWrites: true }
  );

  // Method to update calendar events
  private updateCalendarEvents(events: any[], showSickDays: boolean) {
    this.calendarOptions.set({ events: this.transformEvents(events, showSickDays) });
  }

  // Method to transform the event data
  private transformEvents(events: any[], showSickDays: boolean): any[] {
    const transformedEvents: any[] = [];

    let allowedCalendarIds = this.teamupStore
      .subcalendars()
      .filter((item: any) => item.name === 'Office' || item.name === 'Remote')
      .map((calendar: any) => calendar.id); // Extract only the ids

    if (showSickDays) {
      allowedCalendarIds = this.teamupStore
        .subcalendars()
        .filter((item: any) => item.name === 'Sick' || item.name === 'Holiday')
        .map((calendar: any) => calendar.id); // Extract only the ids
    }

    const clickupTasks = this.clickupStore.tasks();

    events.forEach((event) => {
      if (allowedCalendarIds.includes(event.subcalendar_id)) {
        const eventStartDate = new Date(event.start_dt).toDateString(); // Gets a string like "Fri Nov 01 2024"

        // Find the corresponding task based on the logged date
        const correspondingTask = clickupTasks.find((task: any) => {
          // Convert the dateLogged from string to a number and then to a Date object
          const taskDate = new Date(parseInt(task.dateLogged)); // Ensure we're converting to a number
          const taskStartDate = taskDate.toDateString(); // Convert to date string for comparison

          // Return true if the dates match
          return taskStartDate === eventStartDate;
        });

        transformedEvents.push({
          id: event.id,
          title: ' ', // maybe show type of calendar?=
          start: event.start_dt,
          end: event.end_dt,
          allDay: event.all_day || false,
          extendedProps: {
            email: event.custom?.email || '',
            taskDetails: correspondingTask
              ? {
                  title: correspondingTask.taskTitle,
                  dateLogged: correspondingTask.dateLogged,
                  loggedBy: correspondingTask.loggedBy,
                  duration: correspondingTask.duration, // or any other property you want to include
                }
              : null, // Set to null if no corresponding task is found
          },
        });
      }
    });

    console.log(transformedEvents);

    return transformedEvents;
  }
}
