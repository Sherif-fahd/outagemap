import { Component, OnInit } from '@angular/core';
import { CustomerDataService } from '../srevices/customer-data.service';
import { Customers } from '../_model/customer';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-customer-card',
  templateUrl: './customer-card.component.html',
  styleUrls: ['./customer-card.component.css']
})
export class CustomerCardComponent implements OnInit {
 loadedcustomer: Customers;
 public customerId;

  constructor(
    private data: CustomerDataService ,
    private activeroute: ActivatedRoute,
    private router: Router
    ) {}

    ngOnInit() {
      this.activeroute.paramMap.subscribe( paramMap => {
        if (!paramMap.has('customerId')) {
          return;
        }
        const customerId = paramMap.get('customerId');
        this.loadedcustomer = this.data.getCustomer(this.loadedcustomer.id);
        this.customerId = this.loadedcustomer;
      });
    }
    gotoCustomerslist() {
      const selectedId = this.customerId ? this.customerId : null;
      this.router.navigate(['/customers-details', { id: selectedId}]);
    }


}
