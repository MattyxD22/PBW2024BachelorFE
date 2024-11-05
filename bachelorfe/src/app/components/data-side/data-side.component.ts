import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, inject } from '@angular/core';
import { FullCalendarComponent } from '../full-calendar/full-calendar.component';
import { GlobalStore } from '../../stores/global.store';

@Component({
  selector: 'app-data-side',
  standalone: true,
  imports: [CommonModule, FullCalendarComponent],
  templateUrl: './data-side.component.html',
  styleUrls: ['./data-side.component.scss'] 
})
export class DataSideComponent {
  protected readonly globalStore = inject(GlobalStore)
  @Input() shouldRender: boolean = true;

  visArbejdstimer() {
    this.globalStore.setShowNonWorkingDays(false)
  }

  visFridage() {
    this.globalStore.setShowNonWorkingDays(true)
  }
}
