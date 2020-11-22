import {Component, Input, OnInit} from '@angular/core';
import {Product} from '../../shared/product.model';
import {ProductsService} from '../../shared/products.service';
import {ShoppingCartService} from '../../shopping-cart/shopping-cart.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-production-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent implements OnInit {
  @Input()
  product: Product;

  constructor(private productService: ProductsService,
              private shoppingCartService: ShoppingCartService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

  addItemToCart(): void {
    this.shoppingCartService.addProductToCart(this.product);
  }

  onProductSelected(id: number): void {
    this.router.navigate(['/products', id], {relativeTo: this.route});
  }
}
