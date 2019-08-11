import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomersListComponent } from './customers-list/customers-list.component';
import { CustomerCardComponent} from './customer-card/customer-card.component';
import { CustomersDetailsComponent } from './customers-details/customers-details.component';

const routes: Routes = [
  {
    path: '',
    component: CustomersListComponent

  },

  {
  path: 'info',
  component: CustomerCardComponent
  },

  {
    path: 'customers-details',
    component: CustomersDetailsComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
