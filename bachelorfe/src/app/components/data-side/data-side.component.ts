import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, Signal, ViewEncapsulation, effect, inject } from '@angular/core';
import { FullCalendarComponent } from '../full-calendar/full-calendar.component';
import { GlobalStore } from '../../stores/global.store';
import { ButtonModule } from 'primeng/button';
import { TeamupStore } from '../../stores/teamup.store';
import { ClickupStore } from '../../stores/clickup.store';
import { userType } from '../../types/user.type';
import { ParsedData } from '../../types/parsedData.type';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators'
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-data-side',
  standalone: true,
  imports: [CommonModule, FullCalendarComponent, ButtonModule, CalendarModule, FormsModule],
  templateUrl: './data-side.component.html',
  styleUrls: ['./data-side.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class DataSideComponent implements AfterViewInit {


  protected readonly globalStore = inject(GlobalStore)
  protected readonly clickupStore = inject(ClickupStore)
  protected readonly teamupStore = inject(TeamupStore)

  rangeDates: Date[] = [new Date(), new Date()];;

  //@ViewChild(FullCalendarComponent) fullCalendarComponent!: FullCalendarComponent;
  @Input() shouldRender: boolean = true;
  @Input() currentDevice!: Signal<string> // pass the device type store here as an input, to enable its features

  ngAfterViewInit(): void {
    
  }
  /**
   *
   */
  constructor() {
    effect(() => {
      console.log('Current device type in child:', this.currentDevice());
    });
  }

  visArbejdstimer() {
    this.globalStore.setShowNonWorkingDays(false)
  }

  visFridage() {
    this.globalStore.setShowNonWorkingDays(true)
  }

  parseData(){

    const startDate = this.rangeDates[0].toLocaleDateString(); // Local date string
    const endDate = this.rangeDates[1].toLocaleDateString(); // Local date string

    let users = this.teamupStore.getUsers()
    let tasks:ParsedData[] = [];

    if(users.length === 0){
      console.log('no user selected, returning');
      return;
    }

    console.log('parsing', startDate, endDate)
    const userObservables = users.map((user: userType) => {
      const userEmail = user.email;
    
      return forkJoin({
        userEvents: this.teamupStore.fetchUserEvents(userEmail, startDate, endDate),
        userTasks: this.clickupStore.fetchTaskForUser(userEmail),
      }).pipe(
        map(({ userEvents, userTasks }) => {
          // Format userEvents to include email and parsed hours
          const formattedUserEvents = userEvents.map(event => {
            const start = new Date(event.startDate);
            const end = new Date(event.endDate);
            const hours = (end.getTime() - start.getTime()) / 3600000; // Calculate hours
    
            return {
              email: userEmail,
              hours: hours.toFixed(2), // rounding to 2 decimal places
            };
          });
    
          // Exclude email and hours from userTasks
          const formattedUserTasks = userTasks.map(task => {
            const { loggedBy, duration, ...taskWithoutEmailAndHours } = task;
            return taskWithoutEmailAndHours;
          });

          return {
            userEmail,
            userEvents: formattedUserEvents,
            userTasks: formattedUserTasks
          }

          
        })
      );
    });
    
    forkJoin(userObservables).subscribe({
      next: (results) => {
        this.globalStore.sendExportdata(results)
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      }
    });
    
  }

}
