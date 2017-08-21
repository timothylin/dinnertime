import { FilterType } from './filter-type.enum';
import { FilterOption } from './filter-option';

export class FilterConfig {
  constructor(name: string, field: string, options?: FilterOption[], type?: FilterType) {
    this.name = name;
    this.field = field;
    this.options = options ? options : new Array<FilterOption>();
    this.type = type ? type : FilterType.Dropdown;
  }

  public type: FilterType;
  public name: string;
  public value: string;
  public field: string;
  public options: FilterOption[];
}
