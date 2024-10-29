import { NgStyle } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './user-avatar.component.html',
  styleUrl: './user-avatar.component.scss'
})
export class UserAvatarComponent implements OnInit {

  @Input() userName: string = '';
  @Input() userColor: string = '';

  ngOnInit() {
    if (!this.userColor) {
      this.userColor = this.generateRandomHexColor();
    }
  }

  getInitials(name: string){
    const nameParts = name.trim().split(" ");
  
  if (nameParts.length === 1) {
    // Only one name part, return the first letter
    return nameParts[0][0].toUpperCase();
  } 
  
  // Take the first and last name parts only
  const firstNameInitial = nameParts[0][0].toUpperCase();
  const lastNameInitial = nameParts[nameParts.length - 1][0].toUpperCase();
  
  return `${firstNameInitial}${lastNameInitial}`;
  }

  generateRandomHexColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

}
