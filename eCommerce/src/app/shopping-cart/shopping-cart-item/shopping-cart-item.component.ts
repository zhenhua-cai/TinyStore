import {Component, Input, OnInit} from '@angular/core';
import {Product} from '../../shared/product.model';
import {ShoppingCartItem} from '../ShoppingCartItem.model';
import {ShoppingCartService} from '../../shared/shopping-cart.service';

@Component({
  selector: 'app-shopping-cart-item',
  templateUrl: './shopping-cart-item.component.html',
  styleUrls: ['./shopping-cart-item.component.css']
})
export class ShoppingCartItemComponent implements OnInit {
  @Input()
  shoppingCartItem: ShoppingCartItem;
  @Input()
  itemIndex: number;

  constructor(private shoppingCartService: ShoppingCartService) {
  }

  ngOnInit(): void {
  }

  onSelect(quantity: number): void {
    this.shoppingCartService.changeItemQuantity(this.itemIndex, +quantity);
  }

  onRemoveItem(): void {
    this.shoppingCartService.removeItemFromCart(this.itemIndex);
  }
}
