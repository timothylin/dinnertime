import { PageComponentBase } from '../shared/page-component-base';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../shared/services/recipe.service';
import { Recipe } from '../shared/models/recipe';
import { Ingredient } from '../shared/models/ingredient';

@Component({
  templateUrl: './recipe-detail.html'
})

export class RecipeDetailComponent extends PageComponentBase {

  public recipe: Recipe;
  public nutritionData: Ingredient;
  
  constructor(
    private _recipeService: RecipeService,
    private _route: ActivatedRoute) {
    super();

    this._route.params.subscribe((params) => {
      this.initData(+params['recipeId']);
    });
  }

  private initData(recipeId: number): void {
    this._recipeService.get(recipeId).subscribe((recipe) => {
      console.log(recipe);
      this.recipe = recipe;
      this.calculateNutritionData();
    });
  }

  private calculateNutritionData(): void {
    this.nutritionData = new Ingredient(null);
  }
}
