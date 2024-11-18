import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class GlobalService {
    constructor(private http: HttpClient) { }
    exportCSV(csvData: any) {
        alert(2)
        return new Observable<void>((observer) => {
            this.http.post('http://localhost:3000/api/global/exportcsv', csvData).subscribe({
                next: (response: any) => {
                    alert(3)
                    console.log(response)
                    observer.next();
                    observer.complete();
                },
                error: (error) => {
                    console.error('Error exporting csv: ', error);
                    observer.error(error);
                },
            });
        });
    }

}