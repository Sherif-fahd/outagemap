import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// material
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/Icon';
import {MatMenuModule} from '@angular/material/Menu';
import {MatSidenavModule} from '@angular/material/Sidenav';
import {MatToolbarModule} from '@angular/material/Toolbar';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './nav/menu/menu.component';


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,

  ],


  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
