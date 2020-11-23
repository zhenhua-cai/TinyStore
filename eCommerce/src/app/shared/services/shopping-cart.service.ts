import {Injectable} from '@angular/core';
import {Product} from '../models/product.model';
import {ProductsService} from './products.service';
import {ShoppingCartItem} from '../../shopping-cart/ShoppingCartItem.model';
import {Subject} from 'rxjs';
import {DataTransactionService} from './dataTransaction.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  products: ShoppingCartItem[] = [];
  shoppingCartChanged = new Subject<ShoppingCartItem[]>();
  productsPrice = 0;
  shippingPrice = 0;
  totalPriceChanged = new Subject<number>();
  totalItemsInCart = 0;
  totalItemsChanges = new Subject<number>();

  constructor(private dataTransactionService: DataTransactionService) {
  }

  getShoppingCartItems(): ShoppingCartItem[] {
    return this.products;
  }

  removeItemFromCart(index: number): void {
    this.totalItemsInCart -= this.products[index].quantity;
    this.notifyTotalItemsChange();
    this.productsPrice -= this.products[index].subtotal;
    this.products.splice(index, 1);
    this.notifyShoppingCartChange();
    this.notifyTotalPriceChange();
  }

  addProductToCart(product: Product): void {
    for (const index in this.products) {
      if (this.products[index].id === product.sku) {
        this.products[index].quantity++;
        this.totalItemsInCart++;
        this.productsPrice += this.products[index].product.unitPrice;
        this.products[index].subtotal += this.products[index].product.unitPrice;
        this.notifyTotalPriceChange();
        this.notifyTotalItemsChange();
        return;
      }
    }
    this.products.push({id: product.sku, quantity: 1, subtotal: product.unitPrice, product});
    this.productsPrice += product.unitPrice;
    this.totalItemsInCart++;
    this.notifyTotalPriceChange();
    this.notifyTotalItemsChange();
  }

  changeItemQuantity(index: number, quantity: number): void {
    this.productsPrice -= this.products[index].subtotal;
    this.totalItemsInCart -= this.products[index].quantity;
    this.products[index].quantity = quantity;
    this.products[index].subtotal = this.products[index].quantity * this.products[index].product.unitPrice;
    this.productsPrice += this.products[index].subtotal;
    this.totalItemsInCart += quantity;
    this.notifyTotalPriceChange();
    this.notifyTotalItemsChange();
  }

  checkout(): void {

  }

  private notifyShoppingCartChange(): void {
    this.shoppingCartChanged.next(this.products);
  }

  private notifyTotalPriceChange(): void {
    this.totalPriceChanged.next(this.productsPrice);
  }

  private notifyTotalItemsChange(): void {
    this.totalItemsChanges.next(this.totalItemsInCart);
  }

}


