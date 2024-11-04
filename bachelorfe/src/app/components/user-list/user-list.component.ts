import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { TeamupStore } from '../../stores/teamup.store';
import { ClickupStore } from '../../stores/clickup.store';
import { GlobalStore } from '../../stores/global.store';

@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  imports: [CommonModule, UserAvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {

  protected readonly teamupStore = inject(TeamupStore);
  protected readonly clickupStore = inject(ClickupStore);
  protected readonly globalStore = inject(GlobalStore);

  // Create a signal to hold users
  users = this.teamupStore.getUsers()

  getUserCalendar(email: string) {
    // fetch data from stores to display events for the specific user
    this.teamupStore.setUserEvents(email);
    this.clickupStore.setTasks(email)
    this.globalStore.setShowNonWorkingDays(false) // defaults to "Arbejdstimer"

    // store selected user, to be able to use when scrolling through weeks
    this.clickupStore.setActiveMember(this.clickupStore.members().filter((member: any)=> member.email === email))   

  }

}
