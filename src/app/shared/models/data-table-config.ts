import { ColumnConfig } from './column-config';

export class DataTableConfig {
  constructor(data?: any[]) {
    this.sourceData = data || [];
    this.processedData = [];
    this.isLoading = data ? false : true;
  }

  public sourceData: any[];
  public processedData: any[];
  public columns: ColumnConfig[];
  public isLoading: boolean;
}
