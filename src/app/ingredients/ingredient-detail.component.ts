import { PageComponentBase } from '../shared/page-component-base';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    private _alertService: AlertService,
    private _ingredientService: IngredientService) {
      super();
  }

  public ingredient: Ingredient;
  public nutrition: NutritionFactList;
  public categories: string[];

  public ngOnInit(): void {
    this.categories = this._ingredientService.getCategories();
    this._route.params.subscribe((params) => {
        this.initFormData(+params['ingredientId']);
    });
  }

  public initFormData(ingredientId: number): void {
    this._ingredientService.get(ingredientId)
      .subscribe((data: Ingredient) => {
        this.ingredient = data;
      });

    this._ingredientService.getNutrition(ingredientId)
      .subscribe((data: NutritionFactList) => {
        this.nutrition = data;
      });
  }

  public updateIngredient(): void {
    this._ingredientService.update(this.ingredient).subscribe(() => {
      this._ingredientService.updateNutrition(this.ingredient.id, this.nutrition).subscribe(() => {
        this._alertService.toastSuccess('Ingredient Saved', this.ingredient.name + ' nutrition data and metadata saved successfully.');
      });
    });
  }
}
