import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [

  {
    path: 'customers',
    children: [
      {
        path: '',
        loadChildren: './customers/customers.module#CustomersModule'
      },
      {
        path: 'coustomers-details',
        loadChildren: './customers/customers-details/customers.module#CustomersModule'
      },
      {
        path: 'customers-details/:customerId',
        loadChildren: './customers/customer-card/customer-card.module#Customersodule'
      },
      {
        path: ':customerAddress',
        loadChildren: './customers/location-map/location-map.module#Customersodule'
      },
    ]
  },

  {
  path: 'orders',
  loadChildren: './orders/orders.module#OrdersModule'
  },

  {
  path: 'messages',
  loadChildren: './messages/messages.module#MessagesModule'
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
