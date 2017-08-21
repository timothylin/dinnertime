import { MeasurementType } from './measurement-type.enum';

export class Unit {
  constructor(label: string, value: string, measurementType: MeasurementType) {
    this.label = label;
    this.value = value;
    this.measurementType = measurementType;
  }

  public label: string;
  public value: string;
  public measurementType: MeasurementType;
}
