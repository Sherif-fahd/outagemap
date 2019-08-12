import { Component, OnInit } from '@angular/core';
import { Customers } from '../_model/customer';
import { CustomerDataService } from '../srevices/customer-data.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-customers-details',
  templateUrl: './customers-details.component.html',
  styleUrls: ['./customers-details.component.css']
})
export class CustomersDetailsComponent  implements OnInit {
  customers: Customers[];


  constructor(private data: CustomerDataService, private activerouter: ActivatedRoute) {
  }
  ngOnInit() {
    this.customers = this.data.getData();
  }
}
