import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { UserListComponent } from '../user-list/user-list.component';

@Component({
  selector: 'app-user-side-component',
  standalone: true,
  imports: [UserListComponent, NgClass],
  templateUrl: './user-side.component.html',
  styleUrls: ['./user-side.component.scss'] 
})
export class UserSideComponent {

}
