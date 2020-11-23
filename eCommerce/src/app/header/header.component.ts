import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {faUser} from '@fortawesome/free-solid-svg-icons/faUser';
import {faShoppingCart} from '@fortawesome/free-solid-svg-icons/faShoppingCart';
import {ProductsService} from '../shared/products.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ShoppingCartService} from '../shared/shopping-cart.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  shoppingCartIcon = faShoppingCart;
  userIcon = faUser;
  numOfItemsInCart = 0;
  keyword = '';
  keywordSubscription: Subscription;
  totalItemsChangesSub: Subscription;

  constructor(private shoppingCartService: ShoppingCartService,
              private productService: ProductsService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.totalItemsChangesSub = this.shoppingCartService.totalItemsChanges
      .subscribe(
        (items) => {
          this.numOfItemsInCart = items;
        }
      );
    this.keywordSubscription = this.productService.keywordChanges
      .subscribe((data) => {
        this.keyword = data;
      });
  }

  onClickBrand(): void {
    this.router.navigate(['/'], {relativeTo: this.route});
  }

  onSearch(): void {
    this.productService.searchProductsByNameContaining(this.keyword, 0);
  }

  ngOnDestroy(): void {
    this.keywordSubscription.unsubscribe();
    this.totalItemsChangesSub.unsubscribe();
  }
}
