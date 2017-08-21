import { FilterConfig } from '../models/filter-config';
import { DataFilteredEvent } from '../models/data-filtered-event';

import { EventEmitter, Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class DataService {
  constructor() {
    this.sortAsc = true;
    this.filterText = '';
    this.filters = [];
  }

  get filterText(): string {
    return this._filterText;
  }

  set filterText(t: string) {
    this._filterText = t;
    this.filtersChanged$.emit(null);
  }

  public sortField: string;
  public sortAsc: boolean;
  public filters: FilterConfig[];
  private _filterText: string;

  public filtersChanged$ = new EventEmitter<FilterConfig>();
  public dataFiltered$ = new EventEmitter<DataFilteredEvent>();

  public filterData(data: any[]): any[] {
    const event: DataFilteredEvent = {
      total: data.length,
      matched: data.length
    };

    data = this.filterDataSpecific(data);

    if (!this.filterText || this.filterText.length === 0) {
      return this.processReturn(event, data);
    }

    try {
      const filter = new RegExp(this.filterText, 'i');
      data = data.filter((x) => {
        const matches = JSON.stringify(x).match(filter);
        if (matches === null) {
          return false;
        }
        return matches.length > 0;
      });

      return this.processReturn(event, data);
    } catch (e) {
      console.error('RegEx Matching Error: Free text filter will not be applied.', e);
      return this.processReturn(event, data);
    }
  }

  private filterDataSpecific(data: any[]): any[] {
    if (this.filters.length <= 0) {
      return data;
    }

    return data.filter((x) => {
      let match = true;

      for (const filter of this.filters) {
        if (filter.value === undefined) {
          continue;
        }

        if (Array.isArray(x[filter.field])) {
          let arrayMatch = false;
          const a = x[filter.field];

          for (const option of a) {
            /* tslint:disable:triple-equals */
            if (option == filter.value) {
              /* tslint:enable:triple-equals */
              arrayMatch = true;
            }
          }

          if (!arrayMatch) {
            match = false;
          }
        } else {
          /* tslint:disable:triple-equals */
          if (x[filter.field] != filter.value) {
            /* tslint:enable:triple-equals */
            match = false;
          }
        }
      }

      return match;
    });
  }

  private processReturn(event: DataFilteredEvent, data: any[]): any[] {
    event.matched = data.length;
    this.dataFiltered$.emit(event);
    return data;
  }

  public sortData(data: any[]): any[] {
    return data.sort((previous: any, current: any) => {
      if (!this.sortField) {
        return 0;
      }
      return this.sortAsc
        ? previous[this.sortField] < current[this.sortField] ? -1 : 1
        : previous[this.sortField] > current[this.sortField] ? -1 : 1;
    });
  }
}
