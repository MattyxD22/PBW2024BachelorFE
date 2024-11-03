import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClickupService {

  constructor(private http: HttpClient) { }

  clickupFetchMembers() {  
    return this.http.get<any[]>(`http://localhost:3000/api/clickup/members`);
  }

  clickupFetchTasks(email:string){
    console.log('before fetch');
    
    return this.http.get<any[]>(`http://localhost:3000/api/clickup/tasks/${email}`);
  }


}
