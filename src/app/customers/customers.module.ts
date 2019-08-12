import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersListComponent } from './customers-list/customers-list.component';
import { CustomerCardComponent} from './customer-card/customer-card.component';
import { CustomersDetailsComponent } from './customers-details/customers-details.component';

// mat design
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatIconModule } from '@angular/material/Icon';
import { MatTabsModule } from '@angular/material/Tabs';
import { MatNativeDateModule } from '@angular/material/core';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {MatDialogModule} from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/Toolbar';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/Input';



@NgModule({
  declarations: [CustomersListComponent, CustomerCardComponent, CustomersDetailsComponent,],

  imports: [
    CommonModule,
    CustomersRoutingModule,

    // mat design
    MatCardModule,
    MatTabsModule,
    MatNativeDateModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatToolbarModule,
    MatGridListModule,
    MatFormFieldModule,
    MatMenuModule,
    MatIconModule,
    FormsModule,
    MatInputModule,

  ]
})
export class CustomersModule { }
