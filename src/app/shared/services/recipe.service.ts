import { Injectable } from '@angular/core';
import { Recipe } from '../models/recipe';
import { ApiService } from './api.service';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';

@Injectable()
export class RecipeService {

  constructor(private _apiService: ApiService) {
  }

  public getAll(): Observable<Recipe[]> {
    return this._apiService.get<Recipe[]>('recipes');
  }

  public get(recipeId: number): Observable<Recipe> {
    return this._apiService.get<Recipe>(`recipes/${ recipeId }`);
  }

  public create(recipe: Recipe): Observable<Recipe> {
    return this._apiService.post<Recipe, Recipe>('recipes', recipe);
  }

  public update(recipe: Recipe): Observable<Recipe> {
    return this._apiService.put<Recipe, Recipe>(`recipes/${ recipe.id }`, recipe);
  }

  public delete(recipeId: number): Observable<any> {
    return this._apiService.delete<any>(`recipes/${ recipeId }`);
  }

  public getCategories(): Observable<string[]> {
    return this._apiService.get('recipes/categories');
  }
}
