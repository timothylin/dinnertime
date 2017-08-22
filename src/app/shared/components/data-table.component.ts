import { DataService } from '../services/data.service';
import { DataTableConfig } from '../models/data-table-config';
import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'data-table',
  templateUrl: './data-table.html'
})
export class DataTableComponent implements OnInit, OnChanges {

  @Input() public config: DataTableConfig;
  @Input() public dataService: DataService;

  public selectingAll: boolean = false;
  public filteredCount: number;

  public ngOnInit(): void {
    this.processData();
    this.dataService.filtersChanged$.subscribe((filter) => {
      this.processData();
    });
  }

  public ngOnChanges(): void {
    this.processData();
  }

  private processData() {
    if (!this.config) {
      return;
    }

    // the filtered data
    let data = this.dataService.filterData(this.config.sourceData);

    // save the filteredCount
    this.filteredCount = data.length;

    // sort the data
    data = this.dataService.sortData(data);

    // set the processed data
    this.config.processedData = data;
  }

  public getColumnLabel(column: any): string {
    return column.label ? column.label : column.field.replace(/([A-Z]+)/g, ' $1').replace(/([A-Z][a-z])/g, ' $1');
  }

  public toggleSort(column: any): void {
    if (column.sortable === false) {
      return;
    }

    if (this.dataService.sortField && this.dataService.sortField === column.field) {
      this.dataService.sortAsc = !this.dataService.sortAsc;
    }
    else {
      this.dataService.sortField = column.field;
      this.dataService.sortAsc = true;
    }

    this.processData();
  }
}
