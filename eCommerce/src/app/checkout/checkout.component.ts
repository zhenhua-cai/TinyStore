import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ShoppingCartService} from '../shopping-cart/shopping-cart.service';
import validate = WebAssembly.validate;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  sameAsShipping = false;
  placeOrderForm: FormGroup;
  productPrice = 0;
  shippingFee = 0;
  totalPrice = 0;

  constructor(private shoppingCartService: ShoppingCartService) {
  }

  ngOnInit(): void {
    this.productPrice = this.shoppingCartService.totalPrice;
    this.totalPrice = this.productPrice + this.shippingFee;
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
          state: new FormControl(null, [Validators.required]),
          zipcode: new FormControl(null, [Validators.required]),
        }),
        billingAddress: new FormGroup({
          billingCountry: new FormControl(0, [this.requiredSelection]),
          billingStreet: new FormControl(null, [Validators.required]),
          billingCity: new FormControl(null, [Validators.required]),
          billingState: new FormControl(null, [Validators.required]),
          billingZipcode: new FormControl(null, [Validators.required]),
        }),
      }
    );
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
    console.log(this.placeOrderForm);
  }

  requiredSelection(control: FormControl): { [s: string]: boolean } {
    if (+control.value === 0) {
      return {required: true};
    }
    return null;
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
}
