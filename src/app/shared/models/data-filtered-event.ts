import { IDataFilteredEvent } from './data-filtered-event.interface';

export class DataFilteredEvent {
  constructor(_total: number, _matched: number) {
    this.total = _total;
    this.matched = _matched;
  }

  public total: number;
  public matched: number;
}
