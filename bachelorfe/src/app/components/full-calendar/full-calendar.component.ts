import {
  Component,
  inject,
  signal,
  effect,
  ChangeDetectionStrategy,
  Input,
  Signal,
  ViewChild,
  WritableSignal,
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
  tooltipVisible: WritableSignal<boolean> = signal(false);
  tooltipPosition: WritableSignal<{ top: number; left: number }> = signal({
    top: 0,
    left: 0,
  });
  tooltipData: any = null;
  private hideTooltipTimeout: any; // Timeout reference

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
    weekNumbers: true,
    nowIndicator: true,
    eventMouseEnter: this.onEventMouseEnter.bind(this),
    eventMouseLeave: this.onEventMouseLeave.bind(this),
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
        slotMinTime: '07:00:00',
        slotMaxTime: '21:00:00',
        slotDuration: '00:30:00',
      },
    },
    events: [], // Initialize with an empty array
    eventContent: (arg: any) => {
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
    datesSet: (arg: any) => {
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
    showSickDays: boolean,
  ): any[] {
    const transformedEvents: any[] = [];

    // Define allowed calendar IDs
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

    // Define colors for sub-calendar IDs
    const subCalendarColors: {
      [key: string]: { background: string };
    } = {
      '13752528': { background: 'rgb(71, 112, 216)',}, // Office
      '13752529': { background: 'rgb(79, 181, 161)',}, // Holiday
      '13753382': { background: 'rgb(160, 26, 26)',}, // Sick
      '13753384': { background: 'rgb(119, 66, 169)'}, // Remote
    };

    const subCalendarMap: { [key: number]: string } = {
      13752528: 'Office',
      13752529: 'Holiday',
      13753382: 'Sick',
      13753384: 'Remote',
    };

    flattenedEvents.forEach((event: teamupEventType) => {
      if (allowedCalendarIds.includes(event.subcalenderId)) {
        const eventStartDate = new Date(event.startDate).toDateString(); 
 
        // Find tasks corresponding to the event's date
        const correspondingTasks = clickupTasks.filter(
          (task: clickupTaskType) => {
            const taskDate = new Date(parseInt(task.dateLogged));
            return taskDate.toDateString() === eventStartDate;
          }
        );

        // Get colors for the sub-calendar ID
        const colors = subCalendarColors[event.subcalenderId] || {
          background: '#d3d3d3',
        };

        transformedEvents.push({
          id: `${event.id}-${eventStartDate}`, // Ensure unique ID
          title: event.title || 'Event', // Fallback title
          start: event.startDate,
          end: event.endDate,
          allDay: event.all_day || false,
          backgroundColor: colors.background, // Set background color
          extendedProps: {
            email: event.custom?.email || '',
            subCalendarId: event.subcalenderId,
            subCalendarName: subCalendarMap[event.subcalenderId] || 'Unknown',
            startDate: event.startDate,
          
            taskDetails:
              correspondingTasks.length > 0
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
    return transformedEvents;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('da-DK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  }

  onEventMouseEnter(mouseEnterInfo: any){
    const jsEvent = mouseEnterInfo.jsEvent;

    if (this.hideTooltipTimeout) {
      clearTimeout(this.hideTooltipTimeout); // Cancel any pending hide
    }

    console.log(jsEvent.target);

    const boundingRect = jsEvent.target.getBoundingClientRect();
    const calendarEvent = mouseEnterInfo.event;

    this.tooltipData = {
      email: calendarEvent.extendedProps.email,
      subCalendarName: calendarEvent.extendedProps.subCalendarName || 'Ukendt subkalender',
      start: this.formatDate(calendarEvent.extendedProps.startDate),
    };

    this.tooltipPosition.set({
      top: boundingRect.top + window.scrollY - 50,
      left: boundingRect.left + window.scrollX + 10,
    });

    this.tooltipVisible.set(true);
  }

  
  onEventMouseLeave() {
    this.hideTooltipTimeout = setTimeout(() => {
      this.tooltipData = null;
      this.tooltipVisible.set(false);
    }, 200); // Lille delay, som får det til at virke
  }
}
