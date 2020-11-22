import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Product} from '../shared/product.model';
import {ProductsService} from '../shared/products.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[];
  subscription: Subscription;
  totalPageSubscription: Subscription;
  keyWordEvent: Subscription;
  categoryId = null;
  searchByCategory = false;
  totalPages = 0;
  page = 0;
  totalProducts = 0;
  keyword = null;
  pageChangedSubscription: Subscription;
  pageSize = 0;

  @Input()
  showAllProducts = false;
  private totalProductsSubscription: Subscription;

  constructor(private productService: ProductsService, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.pageSize = this.productService.pageSize;
    this.route.params.subscribe(
      (params: Params) => {
        this.categoryId = params.categoryId;
        if (!this.categoryId) {
          return;
        }
        this.productService.searchProductsByCategory(+this.categoryId, this.page - 1);
      }
    );

    this.categoryId = this.route.snapshot.params.categoryId;
    if (!this.categoryId) {
      this.productService.fetchProducts(this.page - 1);
    } else {
      this.productService.searchProductsByCategory(+this.categoryId, this.page - 1);
    }
    this.subscription = this.productService.productsChanged
      .subscribe(
        (products: Product[]) => {
          this.products = products;
        }
      );
    this.totalPageSubscription = this.productService.totalPagesChanges
      .subscribe(
        (data) => {
          this.totalPages = data;
        }
      );
    this.totalProductsSubscription = this.productService.totalProductsChanges
      .subscribe(
        (data) => {
          this.totalProducts = data;
        }
      );
    this.keyWordEvent = this.productService.keywordChanges
      .subscribe((data) => {
        this.keyword = data;
      });
    this.pageChangedSubscription = this.productService.pageChanged
      .subscribe(
        (data => {
          this.page = data;
        })
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.totalPageSubscription.unsubscribe();
    this.totalProductsSubscription.unsubscribe();
    this.keyWordEvent.unsubscribe();
    this.pageChangedSubscription.unsubscribe();
  }

  fetchPageData(): void {
    if (this.keyword !== null) {
      this.productService.searchProductsByNameContaining(this.keyword, this.page - 1);
    } else if (this.categoryId == null) {
      this.productService.fetchProducts(this.page - 1);
    } else {
      this.productService.searchProductsByCategory(this.categoryId, this.page - 1);
    }
  }
}
