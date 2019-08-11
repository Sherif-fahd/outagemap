import { Component, OnInit } from '@angular/core';
import { CustomerDataService } from '../srevices/customer-data.service';
import { Customers } from '../_model/customer';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-customer-card',
  templateUrl: './customer-card.component.html',
  styleUrls: ['./customer-card.component.css']
})
export class CustomerCardComponent implements OnInit {
 loadedcustomer: Customers;

  constructor(
    private data: CustomerDataService ,
    private activeroute: ActivatedRoute
    ) {}

    ngOnInit() {

      this.activeroute.paramMap.subscribe( paramMap => {
        if (!paramMap.has('customerId')) {
          return;
        }
        const customerId = paramMap.get('customerId');
      });
    }
}
