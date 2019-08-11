import { Component, OnInit } from '@angular/core';
import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { Customers } from '../_model/customer';
import { CustomerDataService } from '../srevices/customer-data.service';

@Pipe({
  name: 'filter'
})
@Component({
  selector: 'app-customers-details',
  templateUrl: './customers-details.component.html',
  styleUrls: ['./customers-details.component.css']
})
export class CustomersDetailsComponent implements PipeTransform  {
  customers: Customers[];
  transform(items: Customers[], field: string, value: string): Customers[] {
    if (!items) {
      return [];
    }
    if (!field || !value) {
      return items;
    }

    return items.filter(singleItem =>
      singleItem[field].toLowerCase().includes(value.toLowerCase())
    );
  }

  constructor(private data: CustomerDataService) {
  }
  getData() {
    this.customers = this.data.getData();

  }

}
