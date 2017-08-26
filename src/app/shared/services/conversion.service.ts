import { Injectable } from '@angular/core';
import { Unit } from '../models/unit';
import { Ingredient } from '../models/ingredient';
import * as _ from 'lodash';

@Injectable()
export class ConversionService {

  private options: Unit[] = [
    new Unit('milligrams', 'mg', 0),
    new Unit('grams', 'g', 0), // ggg g-unit
    new Unit('kilograms', 'kg', 0),
    new Unit('ounces', 'oz', 0),
    new Unit('pounds', 'lb', 0),
    new Unit('milliliters', 'mL', 1),
    new Unit('liters', 'L', 1),
    new Unit('fluid ounces', 'fl oz', 1),
    new Unit('teaspoons', 'tsp', 1),
    new Unit('tablespoons', 'tbsp', 1),
    new Unit('cups', 'c', 1),
    new Unit('pints', 'pt', 1),
    new Unit('quarts', 'qt', 1),
    new Unit('gallons', 'gal', 1),
  ];

  public getMeasurementUnits(): Unit[] {
    return this.options;
  }

  public getMeasurementUnit(value: string) {
    return _.find(this.options, { value });
  }

  /**
   * All nutrition data in the system is stored as milligrams (weight) or milliliters (volume)
   * The default multiplier value assumes conversion from these units.
   */
  public getDefaultMultiplier(destinationUnit: Unit): number {
    switch (destinationUnit.value) {
      case 'mg':
        return 1;
      case 'g':
        return 1000;
      case 'oz':
        return 3.5274e-5;
      case 'lb':
        return 2.20462e-6;
      case 'mL':
        return 1;
      case 'L':
        return 1000;
      case 'fl oz':
        return 0.033814;
      case 'tsp':
        return 0.202884;
      case 'tbsp':
        return 0.067628;
      case 'c':
        return 0.00416667;
      case 'pt':
        return 0.00211337810957;
      case 'qt':
        return 0.00105669;
      case 'gal':
        return 0.000264172;
    }
  }

  /**
   * All nutrition data in the system is stored assuming a serving size of 100g (100000mg) for weight or 100ml for volume
   * This function assumes that the nutritional value is for a serving size of either 100g or 100ml.
   * @param key The key that corresponds to the property on the nutritionFacts object of the ingredient for which we're calculating a value.
   * @param servingSize The number of units in the serving size
   * @param servingSizeUnit The type of units in the serving size
   * @param ingredient The ingredient for which we're calculating nutrition data
   */
  public getServingData(
    key: string,
    servingSize: number,
    servingSizeUnit: Unit,
    ingredient: Ingredient): number {

    let baseServingSize: number = 100000;

    if (servingSizeUnit.measurementType !== ingredient.measurementType) {
      // Need to do density conversion.
      baseServingSize *= ingredient.densityMultiplier;
    }

    const conversionMultiplier = this.getDefaultMultiplier(servingSizeUnit);

    return (ingredient[key] / baseServingSize) * conversionMultiplier * servingSize;
  }
}
