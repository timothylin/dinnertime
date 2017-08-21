export class FilterOption {
  constructor(label: string, value: any, count?: number) {
    this.label = label;
    this.value = value;
    this.count = count;
  }
  public label: string;
  public value: any;
  public count: number;
}
