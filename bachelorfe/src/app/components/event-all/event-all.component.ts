import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private addColorToFridageEvents(events: any[]) {
    return events.map(event => ({
      ...event,
      color: 'red' // Sætter farven til rød for hver fridag event
    }));
  }

  getArbejdstimerEvents() {
    return [
      { title: 'Arbejde', start: '2024-10-28T08:00:00', end: '2024-10-28T16:00:00' },
      { title: 'Arbejde', start: '2024-10-29T08:00:00', end: '2024-10-29T16:00:00' },
      { title: 'Arbejde', start: '2024-10-30T08:00:00', end: '2024-10-30T16:00:00' },
      // flere arbejdstimer events
    ];
  }

  getFridageEvents() {
    const fridageEvents = [
      { title: 'Fridag Event 1', start: '2024-10-31T08:00:00', end: '2024-10-31T16:00:00' },
      { title: 'Fridag Event 2', start: '2024-11-01T08:00:00', end: '2024-11-01T16:00:00' },
      // flere fridage events
    ];
    return this.addColorToFridageEvents(fridageEvents);
  }
}
