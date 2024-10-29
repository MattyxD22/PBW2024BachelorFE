import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FullCalendarComponent } from '../full-calendar/full-calendar.component';

@Component({
  selector: 'app-data-side',
  standalone: true,
  imports: [CommonModule, FullCalendarComponent],
  templateUrl: './data-side.component.html',
  styleUrl: './data-side.component.scss'
})
export class DataSideComponent {

  @Input() shouldRender: boolean = true;

}
