import {
  Component,
  effect,
  EventEmitter,
  inject,
  Input,
  Output,
  Signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { UserSideComponent } from '../user-side-component/user-side.component';
import { userType } from '../../types/user.type';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';

@Component({
  selector: 'app-m-header',
  standalone: true,
  imports: [ButtonModule, CommonModule, UserSideComponent, UserAvatarComponent],
  templateUrl: './m-header.component.html',
  styleUrl: './m-header.component.scss',
})
// M is for "mobile"
export class MHeaderComponent {
  @Input() currentDevice!: Signal<string>;
  @Input() currentUser!: Signal<userType>;
  @Input() userList!: Signal<userType[]>;
  @Input() searchString!: Signal<string>;

  @Output() showWorkingdays = new EventEmitter();
  @Output() showSickDays = new EventEmitter();

  showLeftMenu = false;
  showRightMenu = false;

  toggleMenuLeft() {
    this.showRightMenu = false;
    this.showLeftMenu = !this.showLeftMenu;
  }

  toggleMenuRight() {
    this.showLeftMenu = false;
    this.showRightMenu = !this.showRightMenu;
  }

  closeMenu(type?: number) {
    if (type === 1) {
      // emit event for "arbejdsdage / Working days"
      this.showWorkingdays.emit();
    }
    if (type === 2) {
      // emit event for "fridage / Sick days"
      this.showSickDays.emit();
    }

    this.showRightMenu = false;
    this.showLeftMenu = false;
  }
}
