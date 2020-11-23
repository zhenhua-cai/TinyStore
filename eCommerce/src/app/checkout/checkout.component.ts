import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ShoppingCartService} from '../shared/services/shopping-cart.service';
import validate = WebAssembly.validate;
import {CheckoutService} from './checkout.service';
import {Subject, Subscription} from 'rxjs';
import {Country} from './Country';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  sameAsShipping = false;
  placeOrderForm: FormGroup;
  productPrice = 0;
  shippingFee = 0;
  totalPrice = 0;
  countries: Country[];
  creditCardMonths: number[];
  creditCardYears: number[];
  monthSubscription: Subscription;
  yearSubscription: Subscription;
  countriesSubscription: Subscription;

  constructor(private shoppingCartService: ShoppingCartService, private checkoutService: CheckoutService) {
  }

  ngOnInit(): void {
    this.productPrice = this.shoppingCartService.productsPrice;
    this.totalPrice = this.productPrice + this.shippingFee;
    this.createForm();
    this.addSubcriptions();
    this.getExpirationDate();
    this.checkoutService.getCountries();
  }


  onSelectSameAsShipping(): void {
    this.sameAsShipping = !this.sameAsShipping;
    if (this.sameAsShipping) {
      this.placeOrderForm.removeControl('billingAddress');
    } else {
      this.addBillingControls();
    }
  }

  onSubmit(): void {
    this.shoppingCartService.checkout();
  }

  requiredSelection(control: FormControl): { [s: string]: boolean } {
    if (+control.value === 0) {
      return {required: true};
    }
    return null;
  }


  ngOnDestroy(): void {
    this.monthSubscription.unsubscribe();
    this.yearSubscription.unsubscribe();
    this.countriesSubscription.unsubscribe();
  }

  onMonthChanges(year: number): void {
    const today = new Date();
    if (+year === today.getFullYear()) {
      this.checkoutService.getCreditCardMonths(today.getMonth() + 1);
    } else {
      this.checkoutService.getCreditCardMonths(1);
    }
  }

  onYearChanges(month: number): void {
    const today = new Date();
    if (+month < today.getMonth()) {
      this.checkoutService.getCreditCardYears(today.getFullYear() + 1);
    } else {
      this.checkoutService.getCreditCardYears(today.getFullYear());
    }
  }

  private addSubcriptions(): void {
    this.monthSubscription = this.subscribServiceEvent(this.checkoutService.creditCardMonthEvent,
      (data) => this.creditCardMonths = data);
    this.yearSubscription = this.subscribServiceEvent(this.checkoutService.creditCardYearEvent,
      (data) => this.creditCardYears = data);
    this.countriesSubscription = this.subscribServiceEvent(this.checkoutService.countriesEvent,
      (data) => this.countries = data);
  }

  private subscribServiceEvent(subject: Subject<any>, method: any): Subscription {
    return subject.subscribe(
      method
    );
  }

  private getExpirationDate(): void {
    const year = new Date().getFullYear();
    this.checkoutService.getCreditCardMonths(1);
    this.checkoutService.getCreditCardYears(year);
  }

  private addBillingControls(): void {
    this.placeOrderForm.addControl('billingAddress', new FormGroup({
      billingCountry: new FormControl(0, [this.requiredSelection]),
      billingStreet: new FormControl(null, [Validators.required]),
      billingCity: new FormControl(null, [Validators.required]),
      billingState: new FormControl(null, [Validators.required]),
      billingZipcode: new FormControl(null, [Validators.required]),
    }));
  }

  private createForm(): void {
    this.placeOrderForm = new FormGroup(
      {
        customerInfo: new FormGroup({
          firstName: new FormControl(null),
          middleName: new FormControl(null),
          lastName: new FormControl(null),
          email: new FormControl(null, [Validators.required, Validators.email]),
        }),
        shippingAddress: new FormGroup({
          country: new FormControl(0, [this.requiredSelection]),
          street: new FormControl(null, [Validators.required]),
          city: new FormControl(null, [Validators.required]),
          state: new FormControl(0, [this.requiredSelection]),
          zipcode: new FormControl(null, [Validators.required]),
        }),
        billingAddress: new FormGroup({
          billingCountry: new FormControl(0, [this.requiredSelection]),
          billingStreet: new FormControl(null, [Validators.required]),
          billingCity: new FormControl(null, [Validators.required]),
          billingState: new FormControl(0, [this.requiredSelection]),
          billingZipcode: new FormControl(null, [Validators.required]),
        }),
        creditCard: new FormGroup(
          {
            cardType: new FormControl(0),
            cardHolder: new FormControl(null, [Validators.required]),
            cardNumber: new FormControl(null, [Validators.required]),
            securityCode: new FormControl(null, [Validators.required]),
            expirationMonth: new FormControl(0, [Validators.required, this.requiredSelection]),
            expirationYear: new FormControl(0, [Validators.required, this.requiredSelection])
          }
        )
      }
    );
  }

}
