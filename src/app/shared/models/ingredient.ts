import { NutritionFactList } from './nutrition-fact-list';
import { INutritionData } from './nutrition-data.interface';

export class Ingredient implements INutritionData {
  constructor(name: string, category?: string) {
    this.name = name;
    this.category = category || '';
    this.imageUrl = '';
    this.measurementType = 0;
  }
  public id: number;
  public name: string;
  public category: string;
  public imageUrl: string;
  public measurementType: number;
  public densityMultiplier: number;
  public calories: number;
  public totalFat: number;
  public saturatedFat: number;
  public transFat: number;
  public polyunsaturatedFat: number;
  public monounsaturatedFat: number;
  public totalCarbohydrate: number;
  public sugar: number;
  public fiber: number;
  public protein: number;
  public cholesterol: number;
  public sodium: number;

  public get netCarbs(): number {
    return this.totalCarbohydrate - this.fiber;
  }
}
