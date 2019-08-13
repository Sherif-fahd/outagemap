import { Component, OnInit } from '@angular/core';
import { Customers } from '../_model/customer';
import { CustomerDataService } from '../srevices/customer-data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-location-map',
  templateUrl: './location-map.component.html',
  styleUrls: ['./location-map.component.css']
})
export class LocationMapComponent implements OnInit {
  loadedcustomer: Customers;
  constructor(
    private data: CustomerDataService ,
    private activeroute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.activeroute.paramMap.subscribe( paramMap => {
      if (!paramMap.has('customerAddress')) {
        return;
      }
      const customerAddress = paramMap.get('customerAddress');
      this.loadedcustomer = this.data.getCustomerLocation(this.loadedcustomer.address);
    });
  }

}
