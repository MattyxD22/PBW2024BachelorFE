import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackendService } from '../../services/click-up.service';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  imports: [CommonModule, UserAvatarComponent]
})
export class UserListComponent implements OnInit {
  users: any[] = [
    { "name": "Alice Johnson" },
    { "name": "Bob Smith" },
    { "name": "Charlie Brown" },
    { "name": "Dana White" },
    { "name": "Evan Martinez" },
    { "name": "Fiona Lee" },
    { "name": "George Clark" },
    { "name": "Hannah Scott" },
    { "name": "Ian Thompson" },
    { "name": "Charlie Brown" },
    { "name": "Dana White" },
    { "name": "Evan Martinez" },
    { "name": "Fiona Lee" },
    { "name": "George Clark" },
    { "name": "Hannah Scott" },
    { "name": "Ian Thompson" },
    { "name": "Julia Lopez" }
];

  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
      /* this.backendService.getUsers().subscribe((response: any) => {
      this.users = response.users.map((user: any) => ({
        name: user.username,
        avatar: user.profilePicture
      }));
    });  */
  }
}

