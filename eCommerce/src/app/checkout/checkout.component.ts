import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {ShoppingCartService} from '../shared/services/shopping-cart.service';
import validate = WebAssembly.validate;
import {CheckoutService} from './checkout.service';
import {Subject, Subscription} from 'rxjs';
import {Country} from './Country';
import {State} from './State';

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
  countries: Country[] = [];
  states: State[] = [];
  creditCardMonths: number[];
  creditCardYears: number[];
  monthSubscription: Subscription;
  yearSubscription: Subscription;
  countriesSubscription: Subscription;
  statesSubscription: Subscription;

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

  requiredSelection(control: FormControl): ValidationErrors {
    if (+control.value === 0) {
      return {required: true};
    }
    return null;
  }

  noOnlyWhitespace(control: FormControl): ValidationErrors {
    if (control.value != null && control.value.trim().length === 0) {
      return {notOnlyWhitespace: true};
    }
    return null;
  }


  ngOnDestroy(): void {
    this.monthSubscription.unsubscribe();
    this.yearSubscription.unsubscribe();
    this.countriesSubscription.unsubscribe();
    this.statesSubscription.unsubscribe();
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

  onCountryChange(code: string): void {
    this.checkoutService.getStatesByCountry(code);
  }

  get email(): FormControl {
    return this.placeOrderForm.get('customerInfo.email') as FormControl;
  }

  get lastname(): FormControl {
    return this.placeOrderForm.get('customerInfo.lastName') as FormControl;
  }

  get firstname(): FormControl {
    return this.placeOrderForm.get('customerInfo.firstName') as FormControl;
  }

  get middleName(): FormControl {
    return this.placeOrderForm.get('customerInfo.middleName') as FormControl;
  }

  get shippingCountry(): FormControl {
    return this.placeOrderForm.get('shippingAddress.country') as FormControl;
  }

  get shippingStreet(): FormControl {
    return this.placeOrderForm.get('shippingAddress.street') as FormControl;
  }

  get shippingCity(): FormControl {
    return this.placeOrderForm.get('shippingAddress.city') as FormControl;
  }

  get shippingState(): FormControl {
    return this.placeOrderForm.get('shippingAddress.state') as FormControl;
  }

  get shippingZipcode(): FormControl {
    return this.placeOrderForm.get('shippingAddress.zipcode') as FormControl;
  }

  get expirationMonth(): FormControl {
    return this.placeOrderForm.get('creditCard.expirationMonth') as FormControl;
  }

  get expirationYear(): FormControl {
    return this.placeOrderForm.get('creditCard.expirationYear') as FormControl;
  }

  private addSubcriptions(): void {
    this.monthSubscription = this.subscribServiceEvent(this.checkoutService.creditCardMonthEvent,
      (data) => this.creditCardMonths = data);
    this.yearSubscription = this.subscribServiceEvent(this.checkoutService.creditCardYearEvent,
      (data) => this.creditCardYears = data);
    this.countriesSubscription = this.subscribServiceEvent(this.checkoutService.countriesEvent,
      (data) => this.countries = data);
    this.statesSubscription = this.subscribServiceEvent(this.checkoutService.statesEvent,
      (data) => this.states = data);
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
      billingStreet: new FormControl(null, [Validators.required, this.noOnlyWhitespace]),
      billingCity: new FormControl(null, [Validators.required, this.noOnlyWhitespace]),
      billingState: new FormControl(null, [this.requiredSelection]),
      billingZipcode: new FormControl(null, [Validators.required, this.noOnlyWhitespace]),
    }));
  }

  private createForm(): void {
    this.placeOrderForm = new FormGroup(
      {
        customerInfo: new FormGroup({
          firstName: new FormControl(null, [Validators.required, this.noOnlyWhitespace]),
          middleName: new FormControl(null, [this.noOnlyWhitespace]),
          lastName: new FormControl(null, [Validators.required, this.noOnlyWhitespace]),
          email: new FormControl(null,
            [Validators.required,
              Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
        }),
        shippingAddress: new FormGroup({
          country: new FormControl(0, [this.requiredSelection]),
          street: new FormControl(null, [Validators.required, this.noOnlyWhitespace]),
          city: new FormControl(null, [Validators.required, this.noOnlyWhitespace]),
          state: new FormControl(0, [this.requiredSelection]),
          zipcode: new FormControl(null, [Validators.required, this.noOnlyWhitespace]),
        }),
        billingAddress: new FormGroup({
          billingCountry: new FormControl(0, [this.requiredSelection]),
          billingStreet: new FormControl(null, [Validators.required, this.noOnlyWhitespace]),
          billingCity: new FormControl(null, [Validators.required, this.noOnlyWhitespace]),
          billingState: new FormControl(0, [this.requiredSelection]),
          billingZipcode: new FormControl(null, [Validators.required, this.noOnlyWhitespace]),
        }),
        creditCard: new FormGroup(
          {
            cardType: new FormControl(0),
            cardHolder: new FormControl(null, [Validators.required, this.noOnlyWhitespace]),
            cardNumber: new FormControl(null, [Validators.required, this.noOnlyWhitespace]),
            securityCode: new FormControl(null, [Validators.required, this.noOnlyWhitespace]),
            expirationMonth: new FormControl(0, [this.requiredSelection]),
            expirationYear: new FormControl(0, [this.requiredSelection])
          }
        )
      }
    );
  }


}
