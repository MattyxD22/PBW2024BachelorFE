import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, inject } from '@angular/core';
import { FullCalendarComponent } from '../full-calendar/full-calendar.component';
import { GlobalStore } from '../../stores/global.store';
import { ButtonModule } from 'primeng/button';
import { TeamupStore } from '../../stores/teamup.store';
import { ClickupStore } from '../../stores/clickup.store';
import { userType } from '../../types/user.type';

@Component({
  selector: 'app-data-side',
  standalone: true,
  imports: [CommonModule, FullCalendarComponent, ButtonModule],
  templateUrl: './data-side.component.html',
  styleUrls: ['./data-side.component.scss'] // Korrekt navn (styleUrls)
})
export class DataSideComponent {
  protected readonly globalStore = inject(GlobalStore)

  protected readonly clickupStore = inject(ClickupStore)
  protected readonly teamupStore = inject(TeamupStore)

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

  parseData(){
    console.log('parsing')

    let users = this.teamupStore.getUsers()

    if(users.length === 0){
      console.log('no user selected, returning');
      return;
    }

    users.forEach((user:userType) => {
      console.log(user.email);

      this.teamupStore.parseStoreUserEvents(user.email)
            
    })

    console.log(this.teamupStore.parsedData());
    
  }

}
