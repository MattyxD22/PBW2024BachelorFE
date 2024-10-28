import { Component } from '@angular/core';
import { UserListComponent } from '../components/user-list/user-list.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-user-side-component',
  standalone: true,
  imports: [UserListComponent, NgClass],
  templateUrl: './user-side.component.html',
  styleUrl: './user-side.component.scss'
})
export class UserSideComponent {

}
