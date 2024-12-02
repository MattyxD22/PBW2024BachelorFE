import {
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ContainerComponent } from './components/container/container.component';
import { TeamupService } from './services/teamupServices/teamup.service';
import { TeamupStore } from './stores/teamup.store';
import { ClickupStore } from './stores/clickup.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ContainerComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'bachelorfe';

  protected readonly teamupStore = inject(TeamupStore);
  protected readonly clickupStore = inject(ClickupStore);

  constructor(private teamupService: TeamupService) {}

  ngOnInit(): void {
    this.teamupService.teamupAuthenticate().subscribe({
      next: () => {
        this.teamupStore.setUsers(); // Call setUsers after successful authentication
        this.teamupStore.setSubCalender();
        this.clickupStore.setMembers();
      },
      error: (error) => {
        console.error('Authentication failed:', error);
      },
    });
  }
}
