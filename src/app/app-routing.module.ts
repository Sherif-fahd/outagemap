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
        path: ':customerId',
        loadChildren: './customers/customer-card/customers.module#Customersodule'
      }
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
