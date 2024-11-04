import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, inject } from '@angular/core';
import { FullCalendarComponent } from '../full-calendar/full-calendar.component';
import { GlobalStore } from '../../stores/global.store';

@Component({
  selector: 'app-data-side',
  standalone: true,
  imports: [CommonModule, FullCalendarComponent],
  templateUrl: './data-side.component.html',
  styleUrls: ['./data-side.component.scss'] // Korrekt navn (styleUrls)
})
export class DataSideComponent {
  protected readonly globalStore = inject(GlobalStore)
  //@ViewChild(FullCalendarComponent) fullCalendarComponent!: FullCalendarComponent;
  @Input() shouldRender: boolean = true;

  visArbejdstimer() {
    this.globalStore.setShowNonWorkingDays(false)
    //this.activeTab = 'arbejdstimer'; // Opdater aktiv tilstand
    //this.fullCalendarComponent.visArbejdstimer(); // Kald metoden fra FullCalendarComponent
  }

  visFridage() {
    this.globalStore.setShowNonWorkingDays(true)
    //this.activeTab = 'fridage'; // Opdater aktiv tilstand
    //this.fullCalendarComponent.visFridage(); // Kald metoden fra FullCalendarComponent
  }
}
