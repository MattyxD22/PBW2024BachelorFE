import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { UserListComponent } from '../user-list/user-list.component';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ClickupStore } from '../../stores/clickup.store';
import { TeamupStore } from '../../stores/teamup.store';

@Component({
  selector: 'app-user-side-component',
  standalone: true,
  imports: [UserListComponent, NgClass, IconFieldModule, InputTextModule, InputIconModule],
  templateUrl: './user-side.component.html',
  styleUrls: ['./user-side.component.scss']
})
export class UserSideComponent {

  protected readonly teamupStore = inject(TeamupStore)

  searchUser(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const searchValue = inputElement.value;
    this.teamupStore.setSearchUserString(searchValue);
  }

}
