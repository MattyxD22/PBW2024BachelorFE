import {
  Component,
  inject,
  signal,
  effect,
  ChangeDetectionStrategy,
  Input,
  Signal,
  ViewChild,
} from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { TeamupStore } from '../../stores/teamup.store';
import { ClickupStore } from '../../stores/clickup.store';
import { GlobalStore } from '../../stores/global.store';
import { clickupTaskType } from '../../types/clickup-task.type';
import { teamupEventType } from '../../types/teamup-events.type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-full-calendar',
  standalone: true,
  imports: [FullCalendarModule, CommonModule],
  templateUrl: './full-calendar.component.html',
  styleUrls: ['./full-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FullCalendarComponent {
  calendarVisible = signal(true);

  todaysDate = new Date();

  teamupStore = inject(TeamupStore);
  clickupStore = inject(ClickupStore);
  globalStore = inject(GlobalStore);
  @Input() currentDevice!: Signal<string>;

  //breaking the setup a little bit here, but this is to access the calendar directly
  @ViewChild('calendar') calendarComponent!: { getApi: () => Calendar };

  // Get events from the store
  readonly events = this.teamupStore.getUserCalendars;
  readonly subCalenders = this.teamupStore.getSubcalendars();
  readonly nonWorkingDaysState = this.globalStore.showNonWorkingDays;

  headerBtnsRight = 'timeGridDay,timeGridWeek,dayGridMonth';
  calendarView = 'timeGridWeek';

  constructor() {
    effect(
      () => {
        if (this.currentDevice() === 'mobile') {
          this.headerBtnsRight = '';
          this.calendarComponent.getApi().changeView('timeGridDay');
        } else {
          this.calendarComponent.getApi().changeView('timeGridWeek');
          this.headerBtnsRight = 'timeGridDay,timeGridWeek,dayGridMonth';
        }

        this.calendarOptions.set({
          headerToolbar: {
            left: 'prev today next',
            center: 'title',
            right: this.headerBtnsRight,
          },
        });
      },
      { allowSignalWrites: true }
    );
  }

  // FullCalendar options
  calendarOptions = signal<CalendarOptions>({
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin],
    locale: 'da',
    headerToolbar: {
      left: 'prev today next',
      center: 'title',
      right: this.headerBtnsRight,
    },
    initialView: 'timeGridWeek',
    weekends: true,
    editable: false,
    selectable: false,
    selectMirror: true,
    dayMaxEvents: true,
    expandRows: true,
    nowIndicator: true,
    firstDay: 1,
    eventBackgroundColor: 'PrimaryColor',
    eventOverlap: true, // Allow overlapping events
    slotEventOverlap: true, // Allow overlapping in time slots
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
      const title = event.title || 'Event';

      const taskContent = (extendedProps['taskDetails'] || [])
        .map(
          (task: any) => `
            <div class="task-detail">
              <div><strong>${task.title}</strong></div>
              <div>${task.duration.hours}h ${task.duration.minutes}m</div>
            </div>
          `
        )
        .join('');

      return {
        html: `
          <div>
            <strong>${title}</strong>
            ${taskContent}
          </div>
        `,
      };
    },
    datesSet: (arg) => {
      const startDate = arg.start.toISOString().split('T')[0];
      const endDate = arg.end.toISOString().split('T')[0];

      this.globalStore.setShowingWeek(startDate, endDate);

      const activeMembers = this.clickupStore.activeMembers(); // Assume this returns multiple members
      if (Array.isArray(activeMembers) && activeMembers.length > 0) {
        activeMembers.forEach((member) => {
          this.teamupStore.setUserEvents(member.email, startDate, endDate);
        });
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
  private updateCalendarEvents(events: any, showSickDays: boolean) {
    this.calendarOptions.set({
      events: this.transformEvents(events, showSickDays),
    });
  }

  // Method to transform the event data
  private transformEvents(
    events: Record<string, teamupEventType[]>,
    showSickDays: boolean
  ): any[] {
    const transformedEvents: any[] = [];

    // Flatten the events object into a single array
    const flattenedEvents = Object.values(events).flat();

    // Ensure 'flattenedEvents' is an array before proceeding
    if (!Array.isArray(flattenedEvents)) {
      console.error(
        'Expected an array of events, but received:',
        flattenedEvents
      );
      return transformedEvents; // Return an empty array if events is not an array
    }

    const allowedCalendarIds = this.teamupStore
      .subcalendars()
      .filter((item: any) =>
        showSickDays
          ? ['Sick', 'Holiday'].includes(item.name)
          : ['Office', 'Remote'].includes(item.name)
      )
      .map((calendar: any) => calendar.id);

    const clickupTasks = this.clickupStore.tasks();

    flattenedEvents.forEach((event: teamupEventType) => {
      if (allowedCalendarIds.includes(event.subcalenderId)) {
        const eventStartDate = new Date(event.startDate).toDateString();

        const correspondingTasks = clickupTasks.filter(
          (task: clickupTaskType) =>
            new Date(parseInt(task.dateLogged)).toDateString() ===
            eventStartDate
        );

        transformedEvents.push({
          id: `${event.id}-${eventStartDate}`, // Ensure unique ID
          title: event.title || 'Event', // Fallback title
          start: event.startDate,
          end: event.endDate,
          allDay: event.all_day || false,
          extendedProps: {
            email: event.custom?.email || '',
            taskDetails: correspondingTasks.map((task: any) => ({
              title: task.taskTitle,
              dateLogged: task.dateLogged,
              loggedBy: task.loggedBy,
              duration: task.duration,
            })),
          },
        });
      }
    });

    return transformedEvents;
  }
}
