import {TradeService} from '../service/trade.service';

export class ServerSideDatasource {

  constructor(private fakeServer: FakeServer) {}

  getRows(params: any) {
    console.log('ServerSideDatasource.getRows: params = ', params);

    const request = params.request;

    // if we are on the top level, then group keys will be [],
    // if we are on the second level, then group keys will be like ['United States']
    const groupKeys = request.groupKeys;
    const doingTopLevel = groupKeys.length === 0;

    if (doingTopLevel) {
      this.fakeServer.getTopLevelCountryList(successCallback, request);
    } else {
      const country = request.groupKeys[0];
      this.fakeServer.getCountryDetails(successCallback, country, request);
    }

    function successCallback(resultForGrid, lastRow) {
      params.successCallback(resultForGrid, lastRow);
      console.log('-----------------');
      console.log(resultForGrid);
      console.log('-----------------');
    }
  }
}

export class FakeServer {

  topLevelCountryGroups: any;
  bottomLevelCountryDetails: any;

  constructor(private allData: any) {
    this.init();
  }

  init() {
    const topLevelCountryGroups = [];
    const bottomLevelCountryDetails = {}; // will be a map of [country name => records]

    this.allData.forEach( function(dataItem) {
      // get country this item is for
      const country = dataItem.country;

      // get the top level group for this country
      let childrenThisCountry = bottomLevelCountryDetails[country];
      let groupThisCountry = _.find(topLevelCountryGroups, {country: country});
      if (!childrenThisCountry) {
        // no group exists yet, so create it
        childrenThisCountry = [];
        bottomLevelCountryDetails[country] = childrenThisCountry;

        // add a group to the top level
        groupThisCountry = {country: country, gold: 0, silver: 0, bronze: 0};
        topLevelCountryGroups.push(groupThisCountry);
      }

      // add this record to the county group
      childrenThisCountry.push(dataItem);

      // increment the group sums
      groupThisCountry.gold += dataItem.gold;
      groupThisCountry.silver += dataItem.silver;
      groupThisCountry.bronze += dataItem.bronze;
    });

    this.topLevelCountryGroups = topLevelCountryGroups;
    this.bottomLevelCountryDetails = bottomLevelCountryDetails;

    this.topLevelCountryGroups.sort(function(a, b) { return a.country < b.country ? -1 : 1; });
  }

  sortList(data, sortModel) {
    const sortPresent = sortModel && sortModel.length > 0;
    if (!sortPresent) {
      return data;
    }
    // do an in memory sort of the data, across all the fields
    const resultOfSort = data.slice();
    resultOfSort.sort(function(a, b) {
      for (let k = 0; k < sortModel.length; k++) {
        const sortColModel = sortModel[k];
        const valueA = a[sortColModel.colId];
        const valueB = b[sortColModel.colId];
        // this filter didn't find a difference, move onto the next one
        if (valueA === valueB) {
          continue;
        }
        const sortDirection = sortColModel.sort === 'asc' ? 1 : -1;
        if (valueA > valueB) {
          return sortDirection;
        } else {
          return sortDirection * -1;
        }
      }
      // no filters found a difference
      return 0;
    });
    return resultOfSort;
  }

  getTopLevelCountryList = function(callback, request) {

    const lastRow = this.getLastRowResult(this.topLevelCountryGroups, request);
    const rowData = this.getBlockFromResult(this.topLevelCountryGroups, request);

    // put the response into a timeout, so it looks like an async call from a server
    setTimeout( function() {
      callback(rowData, lastRow);
    }, 1000);
  };

  getCountryDetails(callback, country, request) {

    const countryDetails = this.bottomLevelCountryDetails[country];

    const countryDetailsSorted = this.sortList(countryDetails, request.sortModel);

    const lastRow = this.getLastRowResult(countryDetailsSorted, request);
    const rowData = this.getBlockFromResult(countryDetailsSorted, request);

    // put the response into a timeout, so it looks like an async call from a server
    setTimeout( function() {
      callback(rowData, lastRow);
    }, 1000);
  }

  getBlockFromResult = function(data, request) {
    return data.slice(request.startRow, request.endRow);
  };

  getLastRowResult = function(result, request) {
    // we mimic finding the last row. if the request exceeds the length of the
    // list, then we assume the last row is found. this would be similar to hitting
    // a database, where we have gone past the last row.
    const lastRowFound = (result.length <= request.endRow);
    const lastRow = lastRowFound ? result.length : null;
    return lastRow;
  };
}
