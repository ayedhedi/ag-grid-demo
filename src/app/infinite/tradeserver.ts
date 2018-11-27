import {TradeService} from '../service/trade.service';
import {Column, IServerSideDatasource, IServerSideGetRowsParams} from 'ag-grid-community';
import {InfiniteComponent} from './infinite.component';
import {Filter} from '../shared/filter';
import {Agg} from '../shared/agg';

export class ServerSideDataSource implements IServerSideDatasource {

  constructor(private tradeService: TradeService, private api: any, private comp: InfiniteComponent) {}

  static transformAggregation(entity: string, agg: Agg) {
    return {
      [entity]: agg.name,
      'sum': agg.sum,
      'min': agg.min,
      'max': agg.max,
      'avg': agg.avg,
      'count': agg.count
    };
  }

  getRows(params: IServerSideGetRowsParams) {
    const aggColumns: Column[] = this.comp.aggColumns;
    const request = params.request;
    const groupKeys = request.groupKeys;

    // apply filters
    const filters: Filter[] = [];
    for (let i = 0; i < groupKeys.length; i++) {
      filters.push(<Filter>{
        name: aggColumns[i].getColId(),
        value: groupKeys[i]
      });
    }

    if (aggColumns.length === groupKeys.length) {
      // find trades
      this.getTradesByFilters(filters, this.tradeService, params, this.api, this.getTrades);
    } else {
      // find aggregation
      this.getAggregation(aggColumns[groupKeys.length].getColId(), filters, this.tradeService, params, this.api);
    }
  }

  getTradesByFilters(filters, tradeService, params, api, callback) {
    tradeService.getSizeWithFilters(filters).subscribe(size => {
      callback(filters, tradeService, size, params, api);
    });
  }

  getTrades(filters, tradeService, size, params: IServerSideGetRowsParams, api) {
    tradeService.getTradesWithFilters(filters, params.request.startRow, params.request.endRow).subscribe(trades => {
      params.successCallback(trades, size);
      api.autoSizeAllColumns();
    });
  }

  getAggregation(entity, filters, tradeService, params, api) {
    tradeService.getAggregation(filters, entity).subscribe(aggs => {
      params.successCallback(aggs.map(aa => ServerSideDataSource.transformAggregation(entity, aa)), aggs.length);
      api.autoSizeAllColumns();
    });
  }


}

