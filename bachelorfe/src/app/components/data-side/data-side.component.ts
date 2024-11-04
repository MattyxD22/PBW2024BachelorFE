import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '../full-calendar/full-calendar.component';

@Component({
  selector: 'app-data-side',
  standalone: true,
  imports: [CommonModule, FullCalendarComponent],
  templateUrl: './data-side.component.html',
  styleUrls: ['./data-side.component.scss'] // Korrekt navn (styleUrls)
})
export class DataSideComponent {
  @ViewChild(FullCalendarComponent) fullCalendarComponent!: FullCalendarComponent;
  @Input() shouldRender: boolean = true;

  activeTab: 'arbejdstimer' | 'fridage' = 'arbejdstimer'; // Default til arbejdstimer

  visArbejdstimer() {
    this.activeTab = 'arbejdstimer'; // Opdater aktiv tilstand
    this.fullCalendarComponent.visArbejdstimer(); // Kald metoden fra FullCalendarComponent
  }

  visFridage() {
    this.activeTab = 'fridage'; 
    this.fullCalendarComponent.visFridage(); 
  }
}
