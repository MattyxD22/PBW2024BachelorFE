import { Component, effect, inject, Input, Signal } from '@angular/core';
import { ButtonModule } from "primeng/button"
import { CommonModule } from '@angular/common';
import { UserSideComponent } from "../user-side-component/user-side.component";
import { ClickupStore } from '../../stores/clickup.store';
import { userType } from '../../types/user.type';

@Component({
  selector: 'app-m-header',
  standalone: true,
  imports: [ButtonModule, CommonModule, UserSideComponent],
  templateUrl: './m-header.component.html',
  styleUrl: './m-header.component.scss'
})
export class MHeaderComponent {
  @Input() currentDevice!: Signal<string>
  @Input() currentUser!: Signal<userType>;

  showLeftMenu = false;
  showRightMenu = false;

  toggleMenuLeft() {
    this.showRightMenu = false
    this.showLeftMenu = !this.showLeftMenu
  }

  toggleMenuRight() {
    this.showLeftMenu = false
    this.showRightMenu = !this.showRightMenu
  }

  closeMenu() {
    this.showRightMenu = false
    this.showLeftMenu = false
  }

}
