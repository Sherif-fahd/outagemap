import { Injectable } from '@angular/core';
import { Customers } from '../_model/customer';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CustomerDataService {
  data: Customers[];

  constructor(private router: Router) {

    this.data = [
      {id: 1, name: ' hassan ibrahem' , phone: 123444444 , address: 'Egypt,ALX',
       departmentname: 'IT' , departmentmanger: 'hossni khalil' , customeremail: 'hassan ibrahem@gmail.com' ,
        customerimage: 'sdfdsfdsfdsfds', departmentphone: 1223444444 , activesince: 2014  },

      {id: 2, name: ' Maria Anders' , phone: 123444444 , address: 'Obere Str. 57',
       departmentname: 'ACC' , departmentmanger: 'hossni khalil' , customeremail: 'Maria Anders@gmail.com' ,
        customerimage: 'sdfdsfdsfdsfds', departmentphone: 511223444444 , activesince: 2013  },


      {id: 3, name: ' Fran Wilson' , phone: 123444444 , address: 'Egypt,cairo',
       departmentname: 'DM' , departmentmanger: 'hossni khalil' , customeremail: 'Dominique Perrier@gmail.com' ,
        customerimage: 'sdfdsfdsfdsfds', departmentphone: 111223444444 , activesince: 2012  },

      {id: 4, name: ' Dominique Perrier' , phone: 123444444 , address: 'GRM,Brlin',
       departmentname: 'PR' , departmentmanger: 'hossni khalil' , customeremail: 'hamda@gmail.com' ,
        customerimage: 'sdfdsfdsfdsfds', departmentphone: 911223444444 , activesince: 2015  },

      {id: 5, name: ' Martin Blank' , phone: 123444444 , address: 'Egypt,Asswan',
       departmentname: 'HR' , departmentmanger: 'hossni khalil' , customeremail: 'Martin Blank@gmail.com' ,
        customerimage: 'sdfdsfdsfdsfds', departmentphone: 711223444444 , activesince: 2017  },

      {id: 6, name: ' hassan ibrahem' , phone: 123444444 , address: 'FR,Paris',
       departmentname: 'FF' , departmentmanger: 'hossni khalil' , customeremail: 'hamda@gmail.com' ,
        customerimage: 'sdfdsfdsfdsfds', departmentphone: 11223444444 , activesince: 2018  },


      {id: 7, name: ' jemie oliver' , phone: 123444444 , address: 'USA,LA',
       departmentname: 'IT' , departmentmanger: 'hossni khalil' , customeremail: 'hamda@gmail.com' ,
        customerimage: 'sdfdsfdsfdsfds', departmentphone: 911223444444 , activesince: 2016  },

      {id: 8, name: ' hassan ibrahem' , phone: 123444444 , address: 'Egypt,cairo',
       departmentname: 'IT' , departmentmanger: 'hossni khalil' , customeremail: 'hamda@gmail.com' ,
        customerimage: 'sdfdsfdsfdsfds', departmentphone: 911223444444 , activesince: 2012  },

      {id: 9, name: ' mohsen asherf' , phone: 123444444 , address: 'Egypt,cairo',
       departmentname: 'IT' , departmentmanger: 'hossni khalil' , customeremail: 'hamda@gmail.com' ,
        customerimage: 'sdfdsfdsfdsfds', departmentphone: 811223444444 , activesince: 2014  },

      {id: 10, name: ' yassier badwee' , phone: 123444444 , address: 'Egypt,cairo',
       departmentname: 'IT' , departmentmanger: 'hossni khalil' , customeremail: 'hamda@gmail.com' ,
        customerimage: 'sdfdsfdsfdsfds', departmentphone: 411223444444 , activesince: 2014  },

      {id: 11, name: ' jou pawlo' , phone: 123444444 , address: 'MEX,CA',
       departmentname: 'IT' , departmentmanger: 'hossni khalil' , customeremail: 'hamda@gmail.com' ,
        customerimage: 'sdfdsfdsfdsfds', departmentphone: 711223444444 , activesince: 2014  },

      {id: 12, name: ' hussin alshafiaa' , phone: 123444444 , address: 'Egypt,cairo',
       departmentname: 'IT' , departmentmanger: 'hossni khalil' , customeremail: 'hamda@gmail.com' ,
        customerimage: 'sdfdsfdsfdsfds', departmentphone: 811223444444 , activesince: 2014  },

      {id: 13, name: ' marco fitch' , phone: 123444444 , address: 'USA,W-DC',
       departmentname: 'IT' , departmentmanger: 'hossni khalil' , customeremail: 'hamda@gmail.com' ,
        customerimage: 'sdfdsfdsfdsfds', departmentphone: 691223444444 , activesince: 2014  }


    ];
  }
  getData() {
    return this.data;
  }
  getCustomer(customerId: number) {
    return {
      ...this.data.find(customer => {
        return customer.id === customerId;

      })
    };
  }

}
