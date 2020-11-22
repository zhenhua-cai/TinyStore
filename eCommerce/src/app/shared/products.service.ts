import {Injectable, OnInit} from '@angular/core';
import {Product} from './product.model';
import {DataTransactionService} from './dataTransaction.service';
import {Observable, Subject} from 'rxjs';
import {ProductCategory} from './product-category.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  products: Product[];
  productsChanged = new Subject<Product[]>();
  productCategoriesChanged = new Subject<ProductCategory[]>();
  productDetailChanged = new Subject<Product>();
  totalPagesChanges = new Subject<number>();
  totalProductsChanges = new Subject<number>();
  keywordChanges = new Subject<string>();
  pageSize = 12;
  pageChanged = new Subject<number>();

  constructor(private dataTransaction: DataTransactionService) {
  }

  fetchProducts(page: number): void {
    this.dataTransaction.fetchProducts(page, this.pageSize)
      .subscribe(
        (data) => {
          this.products = data._embedded.products;
          this.productsChanged.next(this.products);
          this.totalPagesChanges.next(data.page.totalPages);
          this.totalProductsChanges.next(data.page.totalElements);
        }
        , error => {
          console.log(error);
        });

  }

  fetchProductCategories(): void {
    this.dataTransaction.fetchProductCategories()
      .subscribe(
        (productCategories) => {
          this.productCategoriesChanged.next(productCategories);
        }
      );
  }

  searchProductsByCategory(id: number, page: number): void {
    this.dataTransaction.searchProductsByCategory(id, page, this.pageSize)
      .subscribe(
        (data) => {
          this.products = data._embedded.products;
          this.productsChanged.next(this.products);
          this.totalPagesChanges.next(data.page.totalPages);
          this.totalProductsChanges.next(data.page.totalElements);
        }, error => {
          console.log(error);
        });
  }

  searchProductsByNameContaining(keyword: string, page: number): void {
    this.keywordChanges.next(keyword);
    console.log(keyword);
    if (keyword == null) {
      keyword = '';
    }
    this.dataTransaction.searchProductsByNameContaining(keyword, page, this.pageSize)
      .subscribe(
        (data) => {
          this.products = data._embedded.products;
          this.productsChanged.next(this.products);
          this.totalPagesChanges.next(data.page.totalPages);
          this.totalProductsChanges.next(data.page.totalElements);

        }
        , error => {
          console.log(error);
        });
  }

  getProductById(id: number): Observable<Product> {
    return this.dataTransaction.searchProductById(id);
  }

  reset(): void {
    this.keywordChanges.next(null);
    this.pageChanged.next(0);
  }

}
