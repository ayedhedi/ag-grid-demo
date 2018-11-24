import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AgGridModule } from 'ag-grid-angular';
import {TradeService} from './service/trade.service';
import { InfiniteComponent } from './infinite/infinite.component';

import { AppRoutingModule } from './app-routing/app-routing.module';
import { GroupingComponent } from './grouping/grouping.component';


@NgModule({
  declarations: [
    AppComponent,
    InfiniteComponent,
    GroupingComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AgGridModule.withComponents([]),
    AppRoutingModule
  ],
  providers: [
    TradeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
