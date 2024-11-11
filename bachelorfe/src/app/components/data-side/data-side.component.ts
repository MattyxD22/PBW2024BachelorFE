import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, inject } from '@angular/core';
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
import { clickupTaskType } from '../../types/clickup-task.type';

@Component({
  selector: 'app-data-side',
  standalone: true,
  imports: [CommonModule, FullCalendarComponent, ButtonModule, CalendarModule, FormsModule],
  templateUrl: './data-side.component.html',
  styleUrls: ['./data-side.component.scss'] // Korrekt navn (styleUrls)
})
export class DataSideComponent {
  protected readonly globalStore = inject(GlobalStore)

  protected readonly clickupStore = inject(ClickupStore)
  protected readonly teamupStore = inject(TeamupStore)

  rangeDates: Date[] = [new Date(), new Date()];;

  //@ViewChild(FullCalendarComponent) fullCalendarComponent!: FullCalendarComponent;
  @Input() shouldRender: boolean = true;

  visArbejdstimer() {
    this.globalStore.setShowNonWorkingDays(false)
    //this.activeTab = 'arbejdstimer'; // Opdater aktiv tilstand
    //this.fullCalendarComponent.visArbejdstimer(); // Kald metoden fra FullCalendarComponent
  }

  visFridage() {
    this.globalStore.setShowNonWorkingDays(true)
    //this.activeTab = 'fridage'; // Opdater aktiv tilstand
    //this.fullCalendarComponent.visFridage(); // Kald metoden fra FullCalendarComponent
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
  
      // Combine both observables and return the combined result
      return forkJoin({

        userEvents: this.teamupStore.fetchUserEvents(userEmail, startDate, endDate),
        userTasks: this.clickupStore.fetchTaskForUser(userEmail),
      }).pipe(
        // Map the result into the desired format
        map(({ userEvents, userTasks }) => {
          // Filter the userTasks to include only those within the selected date range
          const filteredTasks = userTasks.filter((task: clickupTaskType) => {
            const taskDate = new Date(parseInt(task.dateLogged)); // Assuming dateLogged is a timestamp
            console.log(taskDate);
            
            return taskDate >= new Date(startDate) && taskDate <= new Date(endDate);
          });
    
          return {
            userEmail,
            userTasks: filteredTasks, // Only tasks within the selected date range
            userEvents,
          };
        })
      );
    });
  
    // Use forkJoin to wait for all observables to complete
    forkJoin(userObservables).subscribe({
      next: (results) => {
        tasks = results as ParsedData[]; // Assign the fetched data to tasks
        console.log(tasks);
        
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      }
    });
    
  }

}
