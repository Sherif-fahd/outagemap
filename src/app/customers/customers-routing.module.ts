import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomersListComponent } from './customers-list/customers-list.component';
import { CustomerCardComponent} from './customer-card/customer-card.component';
import { CustomersDetailsComponent } from './customers-details/customers-details.component';

const routes: Routes = [
  {path: '', component: CustomersListComponent},
  {path: 'customers-details', component: CustomersDetailsComponent},
  {path: 'customers-details/:id', component: CustomerCardComponent},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }

