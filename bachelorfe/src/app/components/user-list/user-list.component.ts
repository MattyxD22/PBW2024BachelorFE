import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { TeamupStore } from '../../stores/teamup.store';
import { signal } from '@angular/core';

@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  imports: [CommonModule, UserAvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit {

  private teamupStore = inject(TeamupStore);

  // Create a signal to hold users
  users = this.teamupStore.getUsers()
  ngOnInit(): void {
    console.log(1, this.users);
    
  }

  getUserCalendar(email: string) {
    console.log(email);
    this.teamupStore.setUserEvents(email);
    console.log(this.teamupStore.getUserCalendar());
    
  }

}
