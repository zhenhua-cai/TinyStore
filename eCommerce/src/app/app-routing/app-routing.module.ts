import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ShoppingCartComponent} from '../shopping-cart/shopping-cart.component';
import {CheckoutComponent} from '../checkout/checkout.component';
import {ProductsComponent} from '../production/products.component';
import {ProductDetailComponent} from '../production/product-detail/product-detail.component';
import {MainContentComponent} from '../main-content/main-content.component';
import {ProductResolver} from '../production/product-detail/product-resolver.service';

const routes: Routes = [
  {path: '', component: ProductsComponent},
  {
    path: 'products', component: MainContentComponent, children: [
      {path: 'category/:categoryId', component: ProductsComponent},
      {path: ':id', component: ProductDetailComponent, resolve: {product: ProductResolver}}
    ]
  },
  {path: 'shopping-cart', component: ShoppingCartComponent},
  {path: 'checkout', component: CheckoutComponent},
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
