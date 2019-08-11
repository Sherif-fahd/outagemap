import { Component, OnInit } from '@angular/core';
import { Customers } from '../_model/customer';
import { CustomerDataService } from '../srevices/customer-data.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-customers-details',
  templateUrl: './customers-details.component.html',
  styleUrls: ['./customers-details.component.css']
})
export class CustomersDetailsComponent   {
  customers: Customers[];


  constructor(private data: CustomerDataService, private router: Router) {
    this.customers = this.data.getData();
  }
  onSelect(customer) {
    this.router.navigate(['/customers-details', customer.id]);

  }




}
