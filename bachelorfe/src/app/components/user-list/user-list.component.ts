import { Component, OnInit } from '@angular/core';
import { ClickUpService } from '../../services/click-up.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: any[] = [];

  constructor(private clickUpService: ClickUpService) {}

  ngOnInit(): void {
    this.clickUpService.getUsers().subscribe((response: any) => {
      this.users = response.users.map((user: any) => ({
        name: user.username,
        avatar: user.profilePicture
      }));
    });
  }
}