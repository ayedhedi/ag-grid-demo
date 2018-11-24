import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import * as _ from 'lodash';
import {Trade} from '../shared/trade';
import {Agg} from '../shared/agg';
import {Filter} from '../shared/filter';

@Injectable()
export class TradeService {

  constructor(private http: HttpClient) { }

  getPage(from: number, to: number) {
    const url = `http://localhost:8080/trades/?from=${from}&to=${to}`;
    return this.http.get<Trade[]>(url).map(data => _.values(data));
  }

  getTradesWithFilters(filters: Filter[], from: number, to: number) {
    let url = `http://localhost:8080/trades?from=${from}&to=${to}&`;
    filters.forEach(f => {
      url += f.name + '=' + f.value + '&';
    });

    return this.http.get<Trade[]>(url).map(data => _.values(data));
  }

  getSizeWithFilters(filters: Filter[]) {
    let url = 'http://localhost:8080/trades/size?';
    filters.forEach(f => {
      url += f.name + '=' + f.value + '&';
    });

    return this.http.get<number>(url);
  }

  getAggregation(filters: Filter[], entity: string) {
    let url = `http://localhost:8080/aggregation/${entity}?`;
    filters.forEach(f => {
      url += f.name + '=' + f.value + '&';
    });

    return this.http.get<Agg[]>(url).map(data => _.values(data));
  }

}
