import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  Signal,
  ViewEncapsulation,
  inject,
  EventEmitter,
} from '@angular/core';
import { FullCalendarComponent } from '../full-calendar/full-calendar.component';
import { GlobalStore } from '../../stores/global.store';
import { ButtonModule } from 'primeng/button';
import { TeamupStore } from '../../stores/teamup.store';
import { ClickupStore } from '../../stores/clickup.store';
import { userType } from '../../types/user.type';
import { ParsedData } from '../../types/parsedData.type';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { clickupTaskType } from '../../types/clickup-task.type';
import { subcalendarType } from '../../types/teamup-subcalendar.type';

@Component({
  selector: 'app-data-side',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarComponent,
    ButtonModule,
    CalendarModule,
    FormsModule,
  ],
  templateUrl: './data-side.component.html',
  styleUrls: ['./data-side.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DataSideComponent implements AfterViewInit {
  protected readonly globalStore = inject(GlobalStore);
  protected readonly clickupStore = inject(ClickupStore);
  protected readonly teamupStore = inject(TeamupStore);

  rangeDates: Date[] = [new Date(), new Date()];

  //@ViewChild(FullCalendarComponent) fullCalendarComponent!: FullCalendarComponent;
  @Input() shouldRender: boolean = true;
  @Input() currentDevice!: Signal<string>;
  @Input() selectedUsers!: Signal<userType>;
  @Input() userList!: Signal<userType[]>;

  ngAfterViewInit(): void {}
  constructor() {}

  parseData() {
    const startDate = this.rangeDates[0].toLocaleDateString(); // Local date string
    const endDate = this.rangeDates[1].toLocaleDateString(); // Local date string

    const subCalendars = this.teamupStore.subcalendars();

    console.log('calenders: ', subCalendars);

    let selectedUsers = this.clickupStore.activeMembers();
    let tasks: ParsedData[] = [];

    if (selectedUsers.length === 0) {
      console.log('no user selected, returning');
      return;
    }

    const userObservables = selectedUsers.map((user: userType) => {
      const userEmail = user.email;

      return forkJoin({
        userEvents: this.teamupStore.fetchUserEvents(
          userEmail,
          startDate,
          endDate
        ),
        userTasks: this.clickupStore.fetchTaskForUser(userEmail),
      }).pipe(
        map(({ userEvents, userTasks }) => {
          // Format userEvents to include email, parsed hours, and subcalendar name
          const formattedUserEvents = userEvents.map((event) => {
            const start = new Date(event.startDate);
            const end = new Date(event.endDate);
            const hours = (end.getTime() - start.getTime()) / 3600000; // Calculate hours

            // Match the subCalendarId to the corresponding subCalendar and get the name
            const matchedCalendar = subCalendars.find(
              (calendar: subcalendarType) => calendar.id === event.subcalenderId
            );
            const subCalendarName = matchedCalendar
              ? matchedCalendar.name
              : 'Unknown';

            return {
              email: userEmail,
              startDate: event.startDate,
              endDate: event.endDate,
              eventHours: hours.toFixed(2), // rounding to 2 decimal places
              subCalendarName, // Include the calendar name
            };
          });

          const filteredTasks = userTasks.filter((task: any) => {
            const taskCreatedDate = new Date(
              task.formattedDate
            ).toLocaleDateString();
            // Compare task creation date with the range
            return taskCreatedDate >= startDate && taskCreatedDate <= endDate;
          });

          return {
            userEmail,
            userName: user.name,
            userEvents: formattedUserEvents,
            userTasks: filteredTasks,
          };
        })
      );
    });

    forkJoin(userObservables).subscribe({
      next: (results) => {
        this.globalStore.sendExportdata(results);
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      },
    });
  }
}
