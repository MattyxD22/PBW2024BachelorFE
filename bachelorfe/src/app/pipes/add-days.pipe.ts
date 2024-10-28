import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addDays',
  standalone: true 
})
export class AddDaysPipe implements PipeTransform {
  transform(date: Date, days: number): Date {
    const resultDate = new Date(date); 
    resultDate.setDate(resultDate.getDate() + days); 
    return resultDate; 
  }
}
