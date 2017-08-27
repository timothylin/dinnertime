import { RecipeIngredient } from './recipe-ingredient';

export class Recipe {
  constructor(name: string, userId: string, category?: string) {
    this.userId = userId;
    this.name = name;
    this.category = category || '';
    this.imageUrl = '';
    this.instructions = '';
    this.lastUpdated = new Date();
    this.servings = 1;
    this.calories = 0;
    this.totalFat = 0;
    this.totalCarbohydrate = 0;
    this.protein = 0;
    this.ingredients = [];
  }

  public id: number;
  public userId: string;
  public userName: string;
  public name: string;
  public category: string;
  public imageUrl: string;
  public instructions: string;
  public lastUpdated: Date;
  public servings: number;
  public calories: number;
  public totalFat: number;
  public totalCarbohydrate: number;
  public protein: number;
  public ingredients: RecipeIngredient[];
}
