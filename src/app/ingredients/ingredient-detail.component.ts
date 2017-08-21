import { PageComponentBase } from '../shared/page-component-base';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ingredient } from '../shared/models/ingredient';
import { IngredientService } from '../shared/services/ingredient.service';

@Component({
  templateUrl: './ingredient-detail.html'
})

export class IngredientDetailComponent extends PageComponentBase implements OnInit {

  constructor(
    private _route: ActivatedRoute,
    private _ingredientService: IngredientService) {
      super();
  }

  public ingredient: Ingredient;
  public categories: string[];

  public ngOnInit(): void {
    this._route.params.subscribe(params => {
        this.initFormData(+params['ingredientId']);
    });

    this.categories = this._ingredientService.getCategories();
  }

  public initFormData(ingredientId: number): void {
    console.log(ingredientId);
    this._ingredientService.get(ingredientId)
      .subscribe((data: Ingredient) => {
        this.ingredient = data;
      });
  }

  public updateIngredient(): void {
    this._ingredientService.update(this.ingredient);
  }

  // public selectedIngredient: any = {
  //   name: 'Broccoli',
  //   certifiedNutritionFacts: true,
  //   nutritionFacts: new NutritionFactList({
  //     calories: 10,
  //     totalFat: 0,
  //     saturatedFat: 0,
  //     transFat: 0,
  //     polyunsaturatedFat: 0,
  //     monounsaturatedFat: 0,
  //     totalCarbohydrate: 100,
  //     sugar: 0,
  //     fiber: 100,
  //     protein: 0,
  //     cholesterol: 0,
  //     sodium: 0
  //   })
  // };
}
