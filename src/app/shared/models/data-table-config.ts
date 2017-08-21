import { ColumnConfig } from './column-config';

export class DataTableConfig {
  constructor(data: any[]) {
    this.sourceData = data;
    this.processedData = [];
  }

  public sourceData: any[];
  public processedData: any[];
  public columns: ColumnConfig[];
}
