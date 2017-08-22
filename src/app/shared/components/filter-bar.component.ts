import { DataService } from '../services/data.service';
import { LocalStorageService } from '../services/local-storage.service';
import { FilterBarConfig } from '../models/filter-bar-config';
import { FilterConfig } from '../models/filter-config';
import { FilterOption } from '../models/filter-option';
import { DataFilteredEvent } from '../models/data-filtered-event';
import { Component, EventEmitter, Injectable, Input, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'filter-bar',
  providers: [],
  templateUrl: './filter-bar.html'
})
export class FilterBarComponent implements OnInit {
  constructor(private _localStorageService: LocalStorageService) {}

  @Input() public config: FilterBarConfig;
  @Input() public dataService: DataService;

  public ngOnInit() {
    if (this.config.dropdownFilters) {
      this.config.dropdownFilters.forEach((x) => {
        if (!_.find(x.options, (o: FilterOption) => {
          return o.label === 'Any ' + x.name && o.value === undefined;
        })) {
          x.options = [new FilterOption('Any ' + x.name, undefined)].concat(x.options);
        }
      });
    }

    this.dataService.dataFiltered$.subscribe(
      (event: DataFilteredEvent) => this.onDataFiltered(event));
  }

  public get isFiltered(): boolean {
    return this.total !== this.filteredTotal;
  }

  public total: number;
  public filteredTotal: number;

  public setFilterValue(filter: FilterConfig): void {
    this.dataService.filters = this.config.filters;
    this.dataService.filtersChanged$.emit(filter);
  }

  public onDataFiltered(event: DataFilteredEvent): void {
    this.total = event.total;
    this.filteredTotal = event.matched;
  }

  public clearAllFilters(): void {
    this.dataService.filterText = undefined;
    for (const filter of this.config.filters) {
      if (filter.value !== undefined) {
        filter.value = undefined;
        this.dataService.filtersChanged$.emit(filter);
      }
    }
  }
}
