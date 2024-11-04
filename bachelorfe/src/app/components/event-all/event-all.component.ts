import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private addColorToFridageEvents(events: any[]) {
    return events.map(event => ({
      ...event,
      color: 'red'
    }));
  }

  getArbejdstimerEvents() {
    return [
      { title: 'Arbejde', start: '2024-11-04T08:00:00', end: '2024-11-04T16:00:00' },
      { title: 'Arbejde', start: '2024-11-05T08:00:00', end: '2024-11-05T16:00:00' },
      { title: 'Arbejde', start: '2024-11-06T08:00:00', end: '2024-11-06T16:00:00' },
    ];
  }

  getFridageEvents() {
    const fridageEvents = [
      { title: 'Fridag Event 1', start: '2024-11-07T08:00:00', end: '2024-11-07T16:00:00' },
      { title: 'Fridag Event 2', start: '2024-11-08T08:00:00', end: '2024-11-08T16:00:00' },
    ];
    return this.addColorToFridageEvents(fridageEvents);
  }
}
