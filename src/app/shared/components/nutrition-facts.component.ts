import { Component, Input } from '@angular/core';
import { INutritionData } from '../models/nutrition-data.interface';
import { NutritionFactList } from '../models/nutrition-fact-list';
import { LocalStorageService } from '../services/local-storage.service';
import * as _ from 'lodash';

@Component({
  selector: 'nutrition-facts',
  templateUrl: './nutrition-facts.html'
})

export class NutritionFactsComponent {

  constructor(private _localStorageService: LocalStorageService) {
    this.standardDailyRecommended = this._localStorageService.get<INutritionData>('macro-goal:standard');
    this.userDailyRecommended = this._localStorageService.get<INutritionData>('macro-goal:user');
    this.recommendationType = this._localStorageService.get<string>('macro-goal:pref') || 'standard';
  }

  @Input()
  public data: NutritionFactList;

  @Input()
  public enableEditing: boolean;

  public servingSize: number = 100;
  public servingSizeUnit: any = 'g';
  public servingSizeUnitMultiplier: number = 1;

  public standardDailyRecommended: INutritionData;
  public userDailyRecommended: INutritionData;
  public recommendationType: string;

  public setMultiplier(): void {
    switch (this.servingSizeUnit) {
      case 'mg':
        this.servingSizeUnitMultiplier = 1;
        break;
      case 'g':
        this.servingSizeUnitMultiplier = 1000;
        break;
      case 'oz':
        this.servingSizeUnitMultiplier = 28349.5;
        break;
    }
  }

  public getServingData(key: string): number {
    return (this.data[key] / 100) * this.servingSizeUnitMultiplier * this.servingSize;
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
