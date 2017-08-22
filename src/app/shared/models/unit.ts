export class Unit {
  constructor(label: string, value: string, measurementType: number) {
    this.label = label;
    this.value = value;
    this.measurementType = measurementType;
  }

  public label: string;
  public value: string;
  public measurementType: number;
}
