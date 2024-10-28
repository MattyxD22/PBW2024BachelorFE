import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserSideComponent } from './user-side-component/user-side.component'; 
import { DataSideComponent } from './data-side/data-side.component'; 
import { WeekCalenderComponent } from './week-calender/week-calender.component';
import { AddDaysPipe } from './pipes/add-days.pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    UserListComponent,
    UserSideComponent,
    DataSideComponent,
    WeekCalenderComponent,
    AddDaysPipe
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'bachelorfe';
}
