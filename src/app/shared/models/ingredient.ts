import { NutritionFactList } from './nutrition-fact-list';

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
  public nutritionFacts: NutritionFactList;
}
