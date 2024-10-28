import { Component } from '@angular/core';
import { UserListComponent } from "../user-list/user-list.component";
import { ButtonModule } from "primeng/button"
import { CommonModule } from '@angular/common';
import { UserSideComponent } from "../user-side-component/user-side.component";

@Component({
  selector: 'app-m-header',
  standalone: true,
  imports: [UserListComponent, ButtonModule, CommonModule, UserSideComponent],
  templateUrl: './m-header.component.html',
  styleUrl: './m-header.component.scss'
})
export class MHeaderComponent {


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
