import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ShoppingCartService} from '../shared/services/shopping-cart.service';
import validate = WebAssembly.validate;
import {CheckoutService} from './checkout.service';
import {Subscription} from 'rxjs';

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
  creditCardMonths: number[];
  creditCardYears: number[];
  monthSubscription: Subscription;
  yearSubscription: Subscription;

  constructor(private shoppingCartService: ShoppingCartService, private checkoutService: CheckoutService) {
  }

  ngOnInit(): void {
    this.productPrice = this.shoppingCartService.productsPrice;
    this.totalPrice = this.productPrice + this.shippingFee;
    this.createForm();

    this.monthSubscription = this.checkoutService.creditCardMonthEvent.subscribe(
      (months) => {
        this.creditCardMonths = months;
      }
    );
    this.yearSubscription = this.checkoutService.creditCardYearEvent.subscribe(
      (years) => {
        this.creditCardYears = years;

      }
    );
    this.getExpirationDate();
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

  ngOnDestroy(): void {
    this.monthSubscription.unsubscribe();
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
}
