import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductsService} from '../shared/products.service';
import {Product} from '../shared/product.model';
import {ShoppingCartService} from '../shared/shopping-cart.service';
import {ShoppingCartItem} from './ShoppingCartItem.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  productsInCart: ShoppingCartItem[];
  totalPrice = 0;
  productsSubscription: Subscription;
  totalPriceSubscription: Subscription;
  constructor(private shoppingCartService: ShoppingCartService) {
  }

  ngOnInit(): void {
    this.productsInCart = this.shoppingCartService.getShoppingCartItems();
    this.productsSubscription = this.shoppingCartService.shoppingCartChanged.subscribe(
      (productsInCart) => {
        this.productsInCart = productsInCart;
      }
    );
    this.totalPrice = this.shoppingCartService.productsPrice;
    this.totalPriceSubscription = this.shoppingCartService.totalPriceChanged.subscribe(
      (totalPrice) => {
        this.totalPrice = totalPrice;
      }
    );
  }

  ngOnDestroy(): void {
    this.productsSubscription.unsubscribe();
    this.totalPriceSubscription.unsubscribe();
  }

}
