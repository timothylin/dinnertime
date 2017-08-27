import { PageComponentBase } from '../shared/page-component-base';
import { Component } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { RecipeService } from '../shared/services/recipe.service';
import { FilterConfig } from '../shared/models/filter-config';
import { FilterOption } from '../shared/models/filter-option';
import { FilterBarConfig } from '../shared/models/filter-bar-config';
import { Recipe } from '../shared/models/recipe';
import { AlertService } from '../shared/services/alert.service';
import { IdentityService } from '../shared/services/identity.service';
import { Router } from '@angular/router';
import * as _ from 'lodash';

@Component({
  templateUrl: './recipe-list.html'
})

export class RecipeListComponent extends PageComponentBase {
  public dataService: DataService = new DataService();
  public filterBarConfig: FilterBarConfig = new FilterBarConfig();
  public recipes: Recipe[];
  public isLoading: boolean = true;

  constructor(
    private _dataService: DataService,
    private _recipeService: RecipeService,
    private _alertService: AlertService,
    private _identityService: IdentityService,
    private _router: Router) {
    super();

    this.filterBarConfig.textFilteringPlaceholder = 'Name, tags, etc.';

    this._recipeService.getCategories().subscribe((categories) => {
      this.filterBarConfig.filters.push(new FilterConfig('Category', 'category',
      _.map(categories, (category) => {
        return new FilterOption(category, category);
      })));
      this.filterBarConfig.addDefaultFilterOptions();
    });

    this.initCardData();
  }

  public initCardData(): void {
    this._recipeService.getAll().subscribe((data) => {
      console.log(data);
      const filteredData = this.dataService.filterData(data);
      this.recipes = this.dataService.sortData(filteredData);
      this.isLoading = false;
    });
  }

  public addNewRecipe(): void {
    const recipe = new Recipe('New Recipe', this._identityService.getUserId());
    this._recipeService.create(recipe)
      .subscribe((data) => {
        console.log(data);
        this._alertService.toastSuccess('Recipe Added', 'New recipe successfully created.');
        this._router.navigateByUrl(`/recipes/${ data.id }`);
      });
  }
}
