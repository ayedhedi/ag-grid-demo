import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FakeServer, ServerSideDatasource} from './fakeserver';

@Component({
  selector: 'app-grouping',
  templateUrl: './grouping.component.html',
  styleUrls: ['./grouping.component.scss']
})
export class GroupingComponent {

  private gridApi;
  private gridColumnApi;
  private rowData: any[];

  private columnDefs;
  private defaultColDef;
  private autoGroupColumnDef;
  private rowModelType;
  private cacheBlockSize;
  private sideBar;

  constructor(private http: HttpClient) {
    this.defaultColDef = {
      width: 100,
      suppressFilter: true
    };

    this.columnDefs = [
      {
        headerName: 'Athlete',
        field: 'athlete'
      },
      {
        headerName: 'Age',
        field: 'age'
      },
      {
        headerName: 'Country',
        field: 'country',
        width: 200,
        rowGroup: true,
        hide: true
      },
      {
        headerName: 'Year',
        field: 'year'
      },
      {
        headerName: 'Sport',
        field: 'sport'
      },
      {
        headerName: 'Gold',
        field: 'gold'
      },
      {
        headerName: 'Silver',
        field: 'silver'
      },
      {
        headerName: 'Bronze',
        field: 'bronze'
      }
    ];

    this.autoGroupColumnDef = { width: 150 };
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
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.http
      .get('https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json')
      .subscribe(data => {
        const fakeServer = new FakeServer(data);
        const datasource = new ServerSideDatasource(fakeServer);
        params.api.setServerSideDatasource(datasource);
      });
  }


}
