import { EventEmitter, Injectable } from '@angular/core';
import { FilterConfig } from './filter-config';
import { FilterType } from './filter-type.enum';
import { FilterOption } from './filter-option';
import * as _ from 'lodash';

export class FilterBarConfig {
  constructor() {
    this.filters = new Array<FilterConfig>();
  }

  public filters: FilterConfig[];
  public allowTextFiltering: boolean = true;
  public textFilter: string;
  public textFilteringPlaceholder: string;

  public get dropdownFilters(): FilterConfig[] {
    return _.filter(this.filters, (f) => {
      return f.type === FilterType.Dropdown;
    });
  }

  public get badgeFilters(): FilterConfig[] {
    return _.filter(this.filters, (f) => {
      return f.type === FilterType.Badge;
    });
  }

  public addDefaultFilterOptions(): void {
    if (this.dropdownFilters) {
      this.dropdownFilters.forEach((x) => {
        if (!_.find(x.options, (o: FilterOption) => {
          return o.label === 'Any ' + x.name && o.value === undefined;
        })) {
          x.options = [new FilterOption('Any ' + x.name, undefined)].concat(x.options);
        }
      });
    }
  }
}
