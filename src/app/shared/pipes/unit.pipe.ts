import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'unit' })
export class UnitPipe implements PipeTransform {
  public transform(input: number, displayAs: string) {
    switch (displayAs) {
      case 'mg':
        return this.trim(input) + 'mg';
      case 'g':
        return this.trim(input / 1000) + 'g';
      case 'kg':
        return this.trim(input / 1000000) + 'kg';
    }
  }

  private trim(input: number): string {
    if (input % 1 === 0) {
      return input.toString();
    }

    return input.toFixed(1);
  }
}
