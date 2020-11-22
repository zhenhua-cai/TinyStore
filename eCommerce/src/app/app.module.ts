import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {ProductsModule} from './production/products.module';
import {SidebarModule} from './sidebar/sidbar.module';
import {HeaderModule} from './header/header.module';
import { HttpClientModule} from '@angular/common/http';
import { CheckoutComponent } from './checkout/checkout.component';
import {AppRoutingModule} from './app-routing/app-routing.module';
import {ShoppingCartModule} from './shopping-cart/shopping-cart.module';
import {Location} from '@angular/common';
import { MainContentComponent } from './main-content/main-content.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    CheckoutComponent,
    MainContentComponent,
  ],
  imports: [
    BrowserModule,
    HeaderModule,
    ProductsModule,
    SidebarModule,
    HttpClientModule,
    AppRoutingModule,
    ShoppingCartModule,
    NgbModule,
    ReactiveFormsModule
  ],
  providers: [Location],
  bootstrap: [AppComponent]
})
export class AppModule { }
