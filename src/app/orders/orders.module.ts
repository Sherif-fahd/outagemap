import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersListComponent } from './orders-list/orders-list.component';
import {MatTabsModule} from '@angular/material/Tabs';
@NgModule({
  declarations: [OrdersListComponent],


  imports: [
    CommonModule,
    OrdersRoutingModule,
    MatTabsModule,
  ]
})
export class OrdersModule { }
