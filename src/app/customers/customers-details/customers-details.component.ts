import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { Customers } from '../_model/customer';
import { CustomerDataService } from '../srevices/customer-data.service';
import { ActivatedRoute } from '@angular/router';
import { Pipe, PipeTransform, Injectable } from '@angular/core';




@Component({
  selector: 'app-customers-details',
  templateUrl: './customers-details.component.html',
  styleUrls: ['./customers-details.component.css']
})
export class CustomersDetailsComponent  implements OnInit  {
  customers: Customers[];
  name: string;



  constructor(private data: CustomerDataService, private activerouter: ActivatedRoute) {
  }

  ngOnInit() {
    this.customers = this.data.getData();
  }

  search() {
    if (this.name !== '') {
      this.customers = this.customers.filter(res => {
        return res.name.toLocaleLowerCase().match(this.name.toLocaleLowerCase());
      });
    } else if (this.name === '') {
      this.ngOnInit();
    }
  }
}
