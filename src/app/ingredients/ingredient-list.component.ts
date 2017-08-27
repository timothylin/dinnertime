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
import { AlertService } from '../shared/services/alert.service';
import { Router } from '@angular/router';
import * as _ from 'lodash';

@Component({
  templateUrl: './ingredient-list.html'
})

export class IngredientListComponent extends PageComponentBase {
  public dataService: DataService;
  public dataTableConfig: DataTableConfig = new DataTableConfig();
  public filterBarConfig: FilterBarConfig = new FilterBarConfig();

  constructor(
    private _ingredientService: IngredientService,
    private _alertService: AlertService,
    private _router: Router) {

    super();
    this.dataService = new DataService();

    this.filterBarConfig.textFilteringPlaceholder = 'Name, tags, etc.';
    this.dataService.sortField = 'category';

    this._ingredientService.getCategories().subscribe((categories) => {
      this.filterBarConfig.filters.push(new FilterConfig('Category', 'category',
      _.map(categories, (category) => {
        return new FilterOption(category, category);
      })));
      this.filterBarConfig.addDefaultFilterOptions();
    });

    this.initTableData();
  }

  public initTableData(): void {
    this._ingredientService.getAll()
      .subscribe((data) => {
        this.dataTableConfig = new DataTableConfig(data);
        this.dataTableConfig.columns = [
          new ColumnConfig('name', 'Name'),
          new ColumnConfig('category', 'Category'),
          new ColumnConfig('calories', 'Calories'),
          new ColumnConfig('totalCarbohydrate', 'Carbs'),
          new ColumnConfig('totalFat', 'Fat'),
          new ColumnConfig('protein', 'Protein')
        ];
      });
  }

  public addNewIngredient(): void {
    const ingredient = new Ingredient('New Ingredient');
    this._ingredientService.create(ingredient)
      .subscribe((data) => {
        this._alertService.toastSuccess('Ingredient Added', 'New ingredient successfully created.');
        this._router.navigateByUrl(`/ingredients/${ data.id }`);
      });
  }
}
