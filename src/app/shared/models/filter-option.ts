export class FilterOption {
  constructor(label: string, value: any, count?: number, cssClass?: string) {
    this.label = label;
    this.value = value;
    this.count = count;
    this.cssClass = cssClass;
  }
  public label: string;
  public value: any;
  public count: number;
  public cssClass: string;
}
