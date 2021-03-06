import {Injectable} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {Country} from './Country';
import {DataTransactionService} from '../shared/services/dataTransaction.service';
import {State} from './State';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  creditCardMonthEvent = new Subject<number[]>();
  creditCardYearEvent = new Subject<number[]>();
  countriesEvent = new Subject<Country[]>();
  statesEvent = new Subject<State[]>();

  constructor(private dataTransaction: DataTransactionService) {
  }

  getCreditCardMonths(startMonth: number): void {
    const data: number[] = [];
    for (let month = startMonth; month <= 12; month++) {
      data.push(month);
    }
    this.creditCardMonthEvent.next(data);
  }

  getCreditCardYears(startYear: number): void {
    const data: number[] = [];
    for (let year = startYear; year <= startYear + 10; year++) {
      data.push(year);
    }
    this.creditCardYearEvent.next(data);
  }

  getCountries(): void {
    this.dataTransaction.fetchCountries()
      .subscribe(
        (data) => {
          return this.countriesEvent.next(data);
        }
      );
  }
  getStatesByCountry(countryCode: string): void{
    this.dataTransaction.fetchStates(countryCode)
      .subscribe(
        (data) => {
          return this.statesEvent.next(data);
        }
      );
  }
}
