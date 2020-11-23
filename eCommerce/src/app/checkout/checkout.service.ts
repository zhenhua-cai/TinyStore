import {Injectable} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  creditCardMonthEvent = new Subject<number[]>();
  creditCardYearEvent = new Subject<number[]>();

  constructor() {
  }

  getCreditCardMonths(startMonth: number): void{
    const data: number[] = [];
    for (let month = startMonth; month <= 12; month++) {
      data.push(month);
    }
    this.creditCardMonthEvent.next(data);
  }
  getCreditCardYears(startYear: number): void{
    const data: number[] = [];
    for (let year = startYear; year <= startYear + 10; year++) {
      data.push(year);
    }
    this.creditCardYearEvent.next(data);
  }
}
