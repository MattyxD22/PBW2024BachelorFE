import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Signal,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { FullCalendarComponent } from '../full-calendar/full-calendar.component';
import { GlobalStore } from '../../stores/global.store';
import { ButtonModule } from 'primeng/button';
import { TeamupStore } from '../../stores/teamup.store';
import { ClickupStore } from '../../stores/clickup.store';
import { userType } from '../../types/user.type';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { subcalendarType } from '../../types/teamup-subcalendar.type';
import { DeviceTypeStore } from '../../stores/deviceTypes.store';

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
  protected readonly deviceTypeStore = inject(DeviceTypeStore);

  rangeDates: Date[] = [new Date(), new Date()];

  currentDevice: Signal<string> = this.deviceTypeStore.device;
  selectedUsers: Signal<userType[]> = this.clickupStore.activeMembers;

  ngAfterViewInit(): void {}
  constructor() {}

  parseData() {
    const startDate = this.rangeDates[0].toLocaleDateString(); // Local date string
    const endDate = this.rangeDates[1].toLocaleDateString(); // Local date string

    const subCalendars = this.teamupStore.subcalendars();

    if (this.selectedUsers().length === 0) {
      alert('please select at least one employee');
      return;
    }

    const userObservables = this.selectedUsers().map((user: userType) => {
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
