import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TradeService} from '../service/trade.service';
import {ServerSideDataSource} from '../grouping/tradeserver';
import {Column, ColumnRowGroupChangedEvent, RangeSelectionChangedEvent} from 'ag-grid-community';

@Component({
  selector: 'app-infinite',
  templateUrl: './infinite.component.html',
  styleUrls: ['./infinite.component.scss']
})
export class InfiniteComponent {

  private selectedTrades = -1;
  private selectedTradesValue = -1;
  private selectedMinValue = -1;
  private selectedMaxValue = -1;

  private gridApi;
  private gridColumnApi;
  public aggColumns: Column[] = [];

  private columnDefs;
  private defaultColDef;
  private autoGroupColumnDef;
  private rowModelType;
  private cacheBlockSize;
  private sideBar;
  private rowGroupPanelShow;

  constructor(private http: HttpClient, private tradeService: TradeService) {
    this.defaultColDef = {
      width: 100,
      suppressFilter: true
    };

    this.columnDefs = [
      {headerName: 'Id', field: 'tradeId', hide: true },
      {headerName: 'Trades', field: 'count', hide: true },
      {headerName: 'Branch', field: 'branch', enableRowGroup: true },
      {headerName: 'Representative', field: 'representative', enableRowGroup: true },
      {headerName: 'Dealer', field: 'dealer', enableRowGroup: true },
      {headerName: 'Client Number', field: 'clientNumber', enableRowGroup: true },
      {headerName: 'Account', field: 'accountId', enableRowGroup: true },
      {headerName: 'Account Number', field: 'accountNumber', enableRowGroup: true },
      {headerName: 'Status', field: 'status', enableRowGroup: true },
      {headerName: 'Legal Fund', field: 'legalFund', enableRowGroup: true},
      {headerName: 'Sub Fund', field: 'subFund', enableRowGroup: true},
      {headerName: 'Share class', field: 'shareClassCode', enableRowGroup: true},
      {headerName: 'Quantity', field: 'quantity' },
      {headerName: 'Price', field: 'price' },
      {headerName: 'Value in EUR', field: 'valueEur'},
      {headerName: 'Value', field: 'valueUsrCcy' },
      {headerName: 'Currency', field: 'ccy' },
      {headerName: 'Blocked since', field: 'blockedDate' }
    ];

    this.autoGroupColumnDef = { width: 250 };
    this.rowModelType = 'serverSide';
    this.cacheBlockSize = 50;
    this.sideBar = {
      toolPanels: [
        {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
          toolPanelParams: {
            suppressPivots: true,
            suppressPivotMode: true
          }
        }
      ],
      defaultToolPanel: 'columns'
    };
    this.rowGroupPanelShow = 'always';
  }

  onGridReady(params) {
    const that = this;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.gridApi.closeToolPanel();
    const datasource = new ServerSideDataSource(this.tradeService, this.gridColumnApi, this);
    params.api.setServerSideDatasource(datasource);

    this.gridApi.addEventListener('rangeSelectionChanged', (event: RangeSelectionChangedEvent) => {
      that.updateSelection(event);
    });

    this.gridApi.addEventListener('columnRowGroupChanged', (event: ColumnRowGroupChangedEvent) => {
      that.aggColumns = event.columns;
      that.gridColumnApi.setColumnVisible('count', event.columns.length > 0);
    });
  }


  updateSelection(event: RangeSelectionChangedEvent) {
    if (event.started) {
      this.selectedTrades = -1;
      this.selectedTradesValue = -1;
    }
    if (event.finished && event.api.getRangeSelections()) {
      const ranges = event.api.getRangeSelections();
      // find unique indexes
      const indexes = [];
      ranges.forEach((range) => {
        const b = range.start.rowIndex < range.end.rowIndex ? range.start.rowIndex : range.end.rowIndex;
        const e = range.start.rowIndex > range.end.rowIndex ? range.start.rowIndex : range.end.rowIndex;
        for (let i = b; i <= e; i++) {
          indexes.push(i);
        }
      });

      const values = indexes.filter((value, i, self) => {
        return self.indexOf(value) === i;
      }).map(i => {
        return this.gridApi.getDisplayedRowAtIndex(i).data.valueUsrCcy;
      });

      this.selectedTrades = indexes.length;
      this.selectedTradesValue = _.sum(values);
      this.selectedMinValue = _.min(values);
      this.selectedMaxValue = _.max(values);
    }
  }
}
