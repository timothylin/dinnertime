import { NutritionFactList } from './nutrition-fact-list';

export class Ingredient {
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
  public densityMultiplier?: number;
  public calories?: number;
  public totalCarbohydrate?: number;
  public totalFat?: number;
  public protein: number;
}
