import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TradeService} from '../service/trade.service';
import {ServerSideDataSource} from './tradeserver';
import {CellClickedEvent, Column, ColumnRowGroupChangedEvent, RangeSelectionChangedEvent, RowSelectedEvent} from 'ag-grid-community';
import {CustomToolPanelComponent} from '../custom-details-trade-tool-panel/custom-stats-tool-panel.component';

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
  private rowSelection;
  private frameworkComponents;

  constructor(private http: HttpClient, private tradeService: TradeService) {
    this.defaultColDef = {
      width: 100,
      suppressFilter: true
    };

    this.columnDefs = [
      {headerName: 'Trades', field: 'count', hide: true },
      {
        headerName: 'Trade Id',
        field: 'tradeId',
        cellRenderer: (params) => {
          if (params.data.tradeId) {
            return `<span class="fake-link">${params.data.tradeId}</span>`;
          } else {
            return '';
          }
        }
      },
      {headerName: 'Branch', field: 'branch', enableRowGroup: true },
      {headerName: 'Representative', field: 'representative', enableRowGroup: true },
      {headerName: 'Dealer', field: 'dealer', enableRowGroup: true },
      {
        headerName: 'Status',
        field: 'status',
        enableRowGroup: true,
        cellRenderer: (params) => {
          if (params.data.status) {
            return `<img style="padding-top: 10px" src="./assets/${params.data.status.toLowerCase()}.svg"/>`;
          } else {
            return '';
          }
        }
      },
      {headerName: 'Legal Fund', field: 'legalFund', enableRowGroup: true},
      {headerName: 'Sub Fund', field: 'subFund', enableRowGroup: true},
      {headerName: 'Share class', field: 'shareClassCode', enableRowGroup: true},
      {headerName: 'Quantity', field: 'quantity' },
      {headerName: 'Value', field: 'valueUsrCcy' },
      /**
       * {headerName: 'Client Number', field: 'clientNumber'},
       {headerName: 'Account', field: 'accountId'},
       {headerName: 'Account Number', field: 'accountNumber'},
       {headerName: 'Price', field: 'price' },
       {headerName: 'Value in EUR', field: 'valueEur'},
       {headerName: 'Currency', field: 'ccy' },
       {headerName: 'Blocked since', field: 'blockedDate' }
       */
    ];

    this.rowSelection = 'multiple';
    this.autoGroupColumnDef = {
      width: 250 ,
      cellRendererParams: {
        checkbox: true
      }
    };
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
        },
        {
          id: 'tradeDetails',
          labelDefault: 'Trade Details',
          labelKey: 'tradeDetails',
          iconKey: 'trade-details',
          toolPanel: 'customToolPanel'
        }
      ],
      defaultToolPanel: 'columns'
    };
    this.rowGroupPanelShow = 'always';
    this.frameworkComponents = { customToolPanel: CustomToolPanelComponent };
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

    this.gridApi.addEventListener('cellClicked', (event: CellClickedEvent) => {
      if (event.colDef.field === 'tradeId') {
        that.gridApi.openToolPanel('tradeDetails');
      }
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
