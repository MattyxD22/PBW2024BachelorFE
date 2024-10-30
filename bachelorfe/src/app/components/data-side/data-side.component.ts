import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '../full-calendar/full-calendar.component';

@Component({
  selector: 'app-data-side',
  standalone: true,
  imports: [CommonModule, FullCalendarComponent],
  templateUrl: './data-side.component.html',
  styleUrl: './data-side.component.scss'
})
export class DataSideComponent {
  @ViewChild(FullCalendarComponent) fullCalendarComponent!: FullCalendarComponent;

  visArbejdstimer() {
    this.fullCalendarComponent.visArbejdstimer();
  }

  visFridage() {
    this.fullCalendarComponent.visFridage();
  }
  @Input() shouldRender: boolean = true;

}
