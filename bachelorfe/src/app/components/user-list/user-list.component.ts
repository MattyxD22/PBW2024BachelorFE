import {
  ChangeDetectionStrategy,
  Component,
  effect,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  Signal,
} from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit {
  protected readonly teamupStore = inject(TeamupStore);
  protected readonly clickupStore = inject(ClickupStore);
  protected readonly globalStore = inject(GlobalStore);

  @Input() userList!: Signal<userType[]>;
  @Input() selectedUsers!: Signal<userType[]>;
  @Input() searchString!: Signal<string>;

  @Output() close = new EventEmitter();

  ngOnInit(): void {
    console.log(this.selectedUsers());
  }

  closeSidebar() {
    this.close.emit();
  }

  getUserCalendar(email: string) {
    const startOfWeek = this.globalStore.showingWeek().startOfWeek;
    const endOfWeek = this.globalStore.showingWeek().endOfWeek;

    // Toggle the selected user in the activeMembers list
    const user = this.teamupStore
      .users()
      .find((member: userType) => member.email === email);

    if (user) {
      const isMemberActive = this.clickupStore.toggleActiveMember(user);
      if (isMemberActive) {
        this.teamupStore.removeUserEvents(user.email);
      } else {
        // Fetch data from stores to display events for the specific user
        this.teamupStore.setUserEvents(email, startOfWeek, endOfWeek);
        this.clickupStore.setTasks(email);
      }
    }

    this.closeSidebar();
  }

  isSelectedUser(email: string): boolean {
    const selected = this.selectedUsers(); // Access the signal value
    return selected && selected.some((sel) => sel.email === email);
  }
}
