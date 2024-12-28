import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class GlobalService {
    constructor(private http: HttpClient) { }

    async exportCSV(csvData: any): Promise<void> {
        console.log('Sending data (async):', csvData);
        try {
            await this.http
                .post<void>('http://localhost:3000/api/global/exportcsv', csvData, {
                    headers: { 'Content-Type': 'application/json' },
                })
                .toPromise(); // Convert Observable to Promise
            console.log('HTTP POST request (async) was successful');
        } catch (error) {
            console.error('Error during HTTP POST request (async):', error);
            throw error;
        }
    }
    
}