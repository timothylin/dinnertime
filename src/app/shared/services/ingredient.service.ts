import { Injectable } from '@angular/core';
import { Ingredient } from '../models/ingredient';
import { NutritionFactList } from '../models/nutrition-fact-list';
import { LocalStorageService } from './local-storage.service';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';

@Injectable()
export class IngredientService {

  constructor(private _localStorageService: LocalStorageService) {
  }

  public getAll(): Observable<Ingredient[]> {
    return Observable.of(this.enumerate());
  }

  public get(ingredientId: number): Observable<Ingredient> {

    return Observable.of(_.find(this.enumerate(), { id: ingredientId }));
  }

  public create(ingredient: Ingredient): Observable<Ingredient> {
    const ingredients = this.enumerate();
    if (ingredients.length > 0) {
      ingredient.id = _.maxBy(ingredients, 'id').id + 1;
    }
    else {
      ingredient.id = 0;
    }
    ingredients.push(ingredient);
    this.persist(ingredients);
    return Observable.of(ingredient);
  }

  public update(ingredient: Ingredient): Observable<Ingredient> {
    const ingredients = this.enumerate();
    const others = _.filter(ingredients, (i: Ingredient) => {
      return i.id !== ingredient.id;
    });
    others.push(ingredient);
    this.persist(others);
    return Observable.of(ingredient);
  }

  public delete(ingredientId: number): Observable<boolean> {
    const ingredients = this.enumerate();
    const others = _.filter(ingredients, (ingredient: Ingredient) => {
      ingredient.id !== ingredient.id;
    });
    this.persist(others);
    return Observable.of(true);
  }

  private enumerate(): Ingredient[] {
    return _.map(this._localStorageService.get<Ingredient[]>('ingredients') || [], (ingredient: Ingredient) => {
      ingredient.nutritionFacts = new NutritionFactList(ingredient.nutritionFacts);
      return ingredient;
    });
  }

  private persist(ingredients: Ingredient[]): void {
    this._localStorageService.set('ingredients', ingredients);
  }

  public getCategories(): string[] {
    return [
      'Milk & Cream',
      'Cheese',
      'Meats & Poultry',
      'Seafood',
      'Tofus',
      'Rice & Pasta',
      'Breads',
      'Fruits',
      'Vegetables',
      'Oils',
      'Seasoning',
      'Other'
    ];
  }
}
