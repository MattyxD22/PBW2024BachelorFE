import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClickUpService {
  private apiUrl = 'https://api.clickup.com/api/v2/team/9012405900';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer pk_152505215_T23ZXBYK2WA092ALLI0VYD250GV7CSEP'
    });

    return this.http.get(this.apiUrl, { headers });
  }
}
