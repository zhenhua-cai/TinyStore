import {Component, Input, OnInit} from '@angular/core';
import {ProductsService} from '../../shared/products.service';
import {Product} from '../../shared/product.model';
import {ActivatedRoute, Router} from '@angular/router';
import {ShoppingCartService} from '../../shared/shopping-cart.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  id: number;
  product: Product;

  constructor(private shoppingCartService: ShoppingCartService,
              private productService: ProductsService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.productService.getProductById(+this.id);
    // this.productService.productDetailChanged.subscribe(
    //   (product) => {
    //     this.product = product;
    //   }
    // );
    this.route.data.subscribe(
      (data) => {
        this.product = data.product;
      }
    );
  }


  addItemToCart(): void {
    this.shoppingCartService.addProductToCart(this.product);
  }

}
