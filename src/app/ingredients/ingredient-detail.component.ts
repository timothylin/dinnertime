import { PageComponentBase } from '../shared/page-component-base';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Ingredient } from '../shared/models/ingredient';
import { AlertService } from '../shared/services/alert.service';
import { IngredientService } from '../shared/services/ingredient.service';
import { NutritionFactList } from '../shared/models/nutrition-fact-list';

@Component({
  templateUrl: './ingredient-detail.html'
})

export class IngredientDetailComponent extends PageComponentBase implements OnInit {

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _alertService: AlertService,
    private _ingredientService: IngredientService) {
      super();
  }

  public ingredient: Ingredient;
  public categories: string[];

  public ngOnInit(): void {
    this._ingredientService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });

    this._route.params.subscribe((params) => {
        this.initFormData(+params['ingredientId']);
    });
  }

  public initFormData(ingredientId: number): void {
    this._ingredientService.get(ingredientId)
      .subscribe((data: Ingredient) => {
        this.ingredient = data;
      });
  }

  public updateIngredient(): void {
    this._ingredientService.update(this.ingredient).subscribe(() => {
      this._alertService.toastSuccess('Ingredient Saved', this.ingredient.name + ' nutrition data and metadata saved successfully.');
    });
  }

  public deleteIngredient(): void {
    if (window.confirm('Are you sure you want to delete this ingredient?')) {
      this._ingredientService.delete(this.ingredient.id).subscribe(() => {
        this._alertService.toastSuccess('Ingredient Deleted', this.ingredient.name + ' was successfully deleted from the database.');
        this._router.navigateByUrl('/ingredients');
      });
    }
  }
}
