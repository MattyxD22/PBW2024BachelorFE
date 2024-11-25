import { Component, inject, Input, Output, Signal, EventEmitter, effect } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { UserListComponent } from '../user-list/user-list.component';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TeamupStore } from '../../stores/teamup.store';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-user-side-component',
  standalone: true,
  imports: [UserListComponent, NgClass, IconFieldModule, InputTextModule, InputIconModule, ButtonModule, CommonModule],
  templateUrl: './user-side.component.html',
  styleUrls: ['./user-side.component.scss']
})
export class UserSideComponent {

  protected readonly teamupStore = inject(TeamupStore)
  @Input() currentDevice!: Signal<string>

  constructor() {
    
    effect(() => {
      console.log('curr device: ', this.currentDevice());
      
    });
    }

  @Output() closeUserList = new EventEmitter<any>();

  close(){
    this.closeUserList.emit('close');
  }

  searchUser(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const searchValue = inputElement.value;
    this.teamupStore.setSearchUserString(searchValue);
  }

}
