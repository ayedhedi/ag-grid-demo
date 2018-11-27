import { Component, OnInit } from '@angular/core';
import {IToolPanel, IToolPanelParams, RowSelectedEvent, SelectionChangedEvent} from 'ag-grid-community';
import {TradeService} from '../service/trade.service';
import {Trade} from '../shared/trade';
import {unescape} from 'querystring';

@Component({
  selector: 'trade-details',
  templateUrl: './custom-stats-tool-panel.component.html',
  styleUrls: ['./custom-stats-tool-panel.component.scss']
})
export class CustomToolPanelComponent implements IToolPanel {

  private params: IToolPanelParams;

  private trade: Trade = undefined;

  constructor(private tradeService: TradeService) {
  }

  refresh(): void {
  }

  close() {
    this.params.api.closeToolPanel();
  }

  agInit(params: IToolPanelParams): void {
    this.params = params;
    const that = this;

    this.params.api.addEventListener('selectionChanged', (event: SelectionChangedEvent) => {
      const rows = event.api.getSelectedRows();
      if (rows && rows.length === 1) {
        that.tradeService.getTrade(rows[0].tradeId).subscribe(trade => {
          that.trade = trade;
        });
      }
    });
  }

}
