import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatListModule} from '@angular/material/list';
import {SidebarComponent} from './sidebar.component';
import {MatSliderModule} from '@angular/material/slider';
import {RouterModule} from '@angular/router';
import { SidebarItemComponent } from './sidebar-item/sidebar-item.component';



@NgModule({
  declarations: [
    SidebarComponent,
    SidebarItemComponent
  ],
  imports: [
    CommonModule,
    MatListModule,
    RouterModule,
  ],
  exports: [
    SidebarComponent
  ]
})
export class SidebarModule { }
