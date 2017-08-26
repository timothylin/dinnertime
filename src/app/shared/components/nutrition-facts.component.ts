import { Component, Input } from '@angular/core';
import { INutritionData } from '../models/nutrition-data.interface';
import { Ingredient } from '../models/ingredient';
import { LocalStorageService } from '../services/local-storage.service';
import { ConversionService } from '../services/conversion.service';
import { Unit } from '../models/unit';
import { NutritionFactList } from '../models/nutrition-fact-list';
import * as _ from 'lodash';

@Component({
  selector: 'nutrition-facts',
  templateUrl: './nutrition-facts.html'
})

export class NutritionFactsComponent {

  constructor(
    private _localStorageService: LocalStorageService,
    private _conversionService: ConversionService) {

    this.standardDailyRecommended = this._localStorageService.get<INutritionData>('macro-goal:standard');
    this.userDailyRecommended = this._localStorageService.get<INutritionData>('macro-goal:user');
    this.recommendationType = this._localStorageService.get<string>('macro-goal:pref') || 'standard';
  }

  @Input()
  public ingredient: Ingredient;

  @Input()
  public enableEditing: boolean;

  public standardDailyRecommended: INutritionData;
  public userDailyRecommended: INutritionData;
  public recommendationType: string;

  public measurementUnits: Unit[] = this._conversionService.getMeasurementUnits();

  public servingSize: number = 100;
  public servingSizeUnit: string = 'g';

  public getServingData(key: string): number {
    return this._conversionService.getServingData(
      key,
      this.servingSize,
      this._conversionService.getMeasurementUnit(this.servingSizeUnit),
      this.ingredient);
  }

  public getServingPercent(key: string): string {
    let comparison: INutritionData;
    if (this.recommendationType === 'standard') {
      comparison = this.standardDailyRecommended;
    }
    else {
      comparison = this.userDailyRecommended;
    }

    if (!comparison[key] || comparison[key] === -1) {
      return '';
    }

    const result = ((this.getServingData(key) / comparison[key]) * 100);
    if (result % 1 === 0) {
      return result + '%';
    }
    else {
      return result.toFixed(1) + '%';
    }
  }

  public setGoalPreference() {
    this._localStorageService.set('macro-goal:pref', this.recommendationType);
  }
}
