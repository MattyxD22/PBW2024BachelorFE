import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamupService {

  listID = 'eqv4en'
  private authenticationToken = '';

  isAuthenticated = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) { }


  teamupAuthenticate(): Observable<void> {
    return new Observable<void>((observer) => {
      this.http.post('http://localhost:3000/api/teamup/auth', {}).subscribe({
        next: (response: any) => {
          this.authenticationToken = response.auth_token;
          this.isAuthenticated.next(true);
          observer.next(); // Emit success
          observer.complete(); // Complete the observable
        },
        error: (error) => {
          console.error('Error authenticating teamup:', error);
          this.isAuthenticated.next(false);
          observer.error(error); // Emit error
        },
      });
    });
  }

  teamupFetchUsers() {
    const headers = {
      Authorization: `Bearer ${this.authenticationToken}`,
    };

    return this.http.get<any[]>(`http://localhost:3000/api/teamup/searchUser/${this.listID}`, { headers });
  }

  teamupFetchUserCalendar(email: string, startDate?: string, endDate?: string) {
    const headers = {
      Authorization: `Bearer ${this.authenticationToken}`,
    };
    const url = `http://localhost:3000/api/teamup/userEvents/${email}`;
    const params: string[] = [];

    // Conditionally add startDate and endDate to params if they exist
    if (startDate && endDate) {
      params.push(`startDate=${encodeURIComponent(startDate)}`);
      params.push(`endDate=${encodeURIComponent(endDate)}`);
    } 

    // Append the parameters to the URL if any exist
    const fullUrl = params.length ? `${url}?${params.join('&')}` : url;
    console.log('Full URL:', fullUrl, 'Params:', params);

    return this.http.get<any[]>(fullUrl, { headers });
  }

  teamupFetchCalendar() {
    const headers = {
      Authorization: `Bearer ${this.authenticationToken}`,
    };

    return this.http.get<any[]>(`http://localhost:3000/api/teamup/events`, { headers });
  }
  teamupFetchSubCalendar() {
    const headers = {
      Authorization: `Bearer ${this.authenticationToken}`,
    };

    return this.http.get<any[]>(`http://localhost:3000/api/teamup/subcalendars`, { headers });
  }



}
