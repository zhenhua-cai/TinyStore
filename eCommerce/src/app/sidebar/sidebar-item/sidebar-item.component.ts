import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ProductCategory} from '../../shared/models/product-category.model';
import {ProductsService} from '../../shared/services/products.service';

@Component({
  selector: 'app-sidebar-item',
  templateUrl: './sidebar-item.component.html',
  styleUrls: ['./sidebar-item.component.css']
})
export class SidebarItemComponent implements OnInit {
  @Input()
  productCategory: ProductCategory;

  constructor(private productsService: ProductsService) {
  }

  ngOnInit(): void {
  }

  selectItem(): void {
    this.productsService.reset();
  }
}
