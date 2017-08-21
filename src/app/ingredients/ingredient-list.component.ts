import { PageComponentBase } from '../shared/page-component-base';
import { Component } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { DataTableConfig } from '../shared/models/data-table-config';
import { FilterBarConfig } from '../shared/models/filter-bar-config';
import { IngredientService } from '../shared/services/ingredient.service';
import { ColumnConfig } from '../shared/models/column-config';
import { FilterConfig } from '../shared/models/filter-config';
import { FilterOption } from '../shared/models/filter-option';
import { Ingredient } from '../shared/models/ingredient';
import * as _ from 'lodash';

@Component({
  templateUrl: './ingredient-list.html'
})

export class IngredientListComponent extends PageComponentBase {
  public dataService: DataService;
  public dataTableConfig: DataTableConfig;
  public filterBarConfig: FilterBarConfig;

  constructor(private _ingredientService: IngredientService) {
    super();
    this.dataService = new DataService();
    this.dataService.sortField = 'name';

    this.filterBarConfig = new FilterBarConfig();
    this.filterBarConfig.textFilteringPlaceholder = 'Name, tags, etc.';
    this.filterBarConfig.filters.push(new FilterConfig('Category', 'category',
      _.map(this._ingredientService.getCategories(), (category) => {
        return new FilterOption(category, category);
      })));

    this.initTableData();
  }

  public initTableData(): void {
    this._ingredientService.getAll()
      .subscribe((data) => {
        this.dataTableConfig = new DataTableConfig(data);
        this.dataTableConfig.columns = [
          new ColumnConfig('name', 'Name'),
          new ColumnConfig('category', 'Category'),
          new ColumnConfig('nutritionFacts.calories', 'Calories'),
          new ColumnConfig('nutritionFacts.totalCarbohydrate', 'Carbs'),
          new ColumnConfig('nutritionFacts.protein', 'Protein', false)
        ];
      });
  }

  public addNewIngredient(): void {
    const ingredient = new Ingredient('New Ingredient');
    this._ingredientService.create(ingredient);
    this.initTableData();
  }
}
