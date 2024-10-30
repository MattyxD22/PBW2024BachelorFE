import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  getArbejdstimerEvents() {
    return [
      { title: 'Arbejde', start: '2024-10-28T08:00:00', end: '2024-10-28T16:00:00' },
      { title: 'Arbejde', start: '2024-10-29T08:00:00', end: '2024-10-29T16:00:00' },
      { title: 'Arbejde', start: '2024-10-30T08:00:00', end: '2024-10-30T16:00:00' },
      // flere arbejdstimer events
    ];
  }

  getFridageEvents() {
    return [
      { title: 'Syg', start: '2024-10-31T08:00:00', end:'2024-10-31T16:00:00' },
      { title: 'Syg', start: '2024-11-01T08:00:00', end:'2024-11-01T15:30:00' },

      // flere fridage events
    ];
  }
}
