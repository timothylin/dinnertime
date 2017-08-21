import { INutritionData } from './nutrition-data.interface';
import * as _ from 'lodash';

export class NutritionFactList implements INutritionData {

  constructor(data?: any) {
    if (data) {
      _.extend(this, data);
    }
  }

  // Display will be recalculated but serving size unit should always be 100g/100000mg
  public servingSize: number = 100000;

  public calories: number = 0;

  public totalFat: number = 0;
  public saturatedFat: number = 0;
  public transFat: number = 0;
  public polyunsaturatedFat: number = 0;
  public monounsaturatedFat: number = 0;
  
  public totalCarbohydrate: number = 0;
  public sugar: number = 0
  public fiber: number = 0

  public get netCarbs(): number {
    return this.totalCarbohydrate - this.fiber;
  }

  public protein: number = 0;
  public cholesterol: number = 0;
  public sodium: number = 0;
}