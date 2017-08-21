import { NutritionFactList } from './nutrition-fact-list';
import { MeasurementType } from './measurement-type.enum';

export class Ingredient {
  constructor(name: string, category?: string) {
    this.name = name;
    this.category = category;
    this.nutritionFacts = new NutritionFactList();
  }
  public id: number;
  public name: string;
  public category: string;
  public imageUrl: string;
  public measurementType: MeasurementType;
  public densityMultiplier?: number;
  public nutritionFacts: NutritionFactList;
}
