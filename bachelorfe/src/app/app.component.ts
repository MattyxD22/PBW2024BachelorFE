import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ContainerComponent } from './components/container/container.component';
import { TeamupService } from './services/teamupServices/teamup.service';
import { TeamupStore } from './stores/teamup.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ContainerComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'bachelorfe';

  teamupStore = inject(TeamupStore)

  constructor(private teamupService: TeamupService) {

  }

  ngOnInit(): void {
    this.teamupService.teamupAuthenticate().subscribe({
      next: () => {
        this.teamupStore.setUsers(); // Call setUsers after successful authentication
        //this.teamupStore.setCalender();
      },
      error: (error) => {
        console.error('Authentication failed:', error);
      },
    });
  }

}
