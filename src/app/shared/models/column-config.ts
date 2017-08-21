export class ColumnConfig {
  constructor(field: string, label?: string, sortable?: boolean) {
    this.field = field;
    this.label = label || field;
    this.sortable = sortable || true;
  }

  public field: string;
  public label: string;
  public sortable: boolean;
}
