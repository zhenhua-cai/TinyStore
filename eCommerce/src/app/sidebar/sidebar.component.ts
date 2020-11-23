import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ProductCategory} from '../shared/models/product-category.model';
import {ProductsService} from '../shared/services/products.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSelectionList} from '@angular/material/list';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  productCategories: ProductCategory[];
  subscription: Subscription;
  constructor(private productsService: ProductsService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.productsService.fetchProductCategories();
    this.subscription = this.productsService.productCategoriesChanged.subscribe(
      (productCategories: ProductCategory[]) => {
        this.productCategories = productCategories;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
