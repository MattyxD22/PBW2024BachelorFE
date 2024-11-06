import { Component, inject, signal, effect } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { EventService } from '../event-all/event-all.component';
import { TeamupStore } from '../../stores/teamup.store';
import { ClickupStore } from '../../stores/clickup.store';
import { GlobalStore } from '../../stores/global.store';
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

  todaysDate = new Date();

  teamupStore = inject(TeamupStore);
  clickupStore = inject(ClickupStore);
  globalStore = inject(GlobalStore);

  // Get events from the store
  readonly events = this.teamupStore.getUserCalendar;
  readonly subCalenders = this.teamupStore.getSubcalendars();
  readonly nonWorkingDaysState = this.globalStore.showNonWorkingDays;

  // FullCalendar options
  calendarOptions = signal<CalendarOptions>({
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin],
    locale: 'da',
    headerToolbar: {
      left: 'prev today next',
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
    
      // Set default title
      const title = event.title || 'Event';
      const taskDetails = extendedProps['taskDetails'];
    
      // Handle cases where taskDetails is null or undefined
      if (!taskDetails || taskDetails.length === 0) {
        return { html: `<div><strong>${title}</strong></div>` };
      }
    
      // Render multiple task details if available
      const taskContent = taskDetails
        .map((task:any) => `
          <div class="task-detail">
            <div><strong>${task.title}</strong></div>
            <div>${task.duration.hours}h ${task.duration.minutes}m</div>
          </div>
        `)
        .join('');
    
      return {
        html: `
          <div class="border-b">
            <strong>${title}</strong>
            ${taskContent}
          </div>
        `,
      };
    },
    datesSet: (arg) => {
      const startDate = arg.start.toISOString().split('T')[0];
      const endDate = arg.end.toISOString().split('T')[0];
      const activeMember = this.clickupStore.activeMember()
      if (activeMember) {
          this.teamupStore.setUserEvents(activeMember.email, startDate, endDate);
      } 
  },
  });

  visArbejdstimer() {
    const currentEvents = this.events();
    this.updateCalendarEvents(currentEvents, false);
  }

  visFridage() {
    const currentEvents = this.events();
    this.updateCalendarEvents(currentEvents, true);
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

  private nonWorkingDaysEffect = effect(
    () => {
      const nonWorkingDaysState = this.nonWorkingDaysState();
      const currentEvents = this.events();
      this.updateCalendarEvents(currentEvents, nonWorkingDaysState);
    },
    { allowSignalWrites: true }
  );

  // Method to update calendar events
  private updateCalendarEvents(events: any[], showSickDays: boolean) {
    this.calendarOptions.set({
      events: this.transformEvents(events, showSickDays),
    });
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
    
        // Find all corresponding tasks based on the logged date
        const correspondingTasks = clickupTasks.filter((task: any) => {
          const taskDate = new Date(parseInt(task.dateLogged));
          const taskStartDate = taskDate.toDateString();
          return taskStartDate === eventStartDate;
        });
    
        transformedEvents.push({
          id: event.id,
          title: ' ', // maybe show type of calendar?
          start: event.start_dt,
          end: event.end_dt,
          allDay: event.all_day || false,
          extendedProps: {
            email: event.custom?.email || '',
            taskDetails: correspondingTasks.length > 0
              ? correspondingTasks.map((task: any) => ({
                  title: task.taskTitle,
                  dateLogged: task.dateLogged,
                  loggedBy: task.loggedBy,
                  duration: task.duration, // or any other property you want to include
                }))
              : null, // Set to null if no corresponding tasks are found
          },
        });
      }
    });

    console.log(transformedEvents);

    return transformedEvents;
  }
}
