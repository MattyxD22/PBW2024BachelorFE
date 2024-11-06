import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { TeamupStore } from '../../stores/teamup.store';
import { ClickupStore } from '../../stores/clickup.store';
import { GlobalStore } from '../../stores/global.store';
import { userType } from '../../types/user.type';

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

  selectedMember = this.clickupStore.activeMember()
  private selectedMemberEffect = effect(
    () => {
      this.selectedMember = this.clickupStore.activeMember()
    },
    { allowSignalWrites: true }
  );

  getUserCalendar(email: string) {

    // Fetch data from stores to display events for the specific user
    this.teamupStore.setUserEvents(email);
    this.clickupStore.setTasks(email);
    this.globalStore.setShowNonWorkingDays(false); // Defaults to "Arbejdstimer"

    // Store the selected user, allowing the app to use it when scrolling through weeks
    const user = this.clickupStore.members().find((member: userType) => member.email === email);

    if (user) {
      this.clickupStore.setActiveMember(user);
    }
  }
}
