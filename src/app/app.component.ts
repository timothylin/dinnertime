import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/distinctUntilChanged';
import { NAV_ITEMS } from './app.nav';
import * as Pace from 'pace-progress';

import { LocalStorageService } from './shared/services/local-storage.service';
import { INutritionData } from './shared/models/nutrition-data.interface';

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './app.html'
})
export class AppComponent {

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _localStorageService: LocalStorageService) {

      // Subscribe to router events to handle on change events.
      this._router.events.distinctUntilChanged((previous: any, current: any) => {
          if (current instanceof NavigationEnd) {
            return previous.url === current.url;
          }
          return true;
      }).subscribe((x: any) => {
        // Workaround for https://github.com/angular/angular/issues/6946
        window.scrollTo(0, 0);
      });

      this._localStorageService.set('macro-goal:standard', {
        calories: 2000,
        totalFat: 65000,
        saturatedFat: 20000,
        transFat: 2000,
        polyunsaturatedFat: -1,
        monounsaturatedFat: -1,
        totalCarbohydrate: 300000,
        sugar: 50000,
        fiber: 28000,
        protein: 50000,
        cholesterol: 300,
        sodium: 2400
      } as INutritionData);

      // TODO: Set this value from a configuration page, not here...
      this._localStorageService.set('macro-goal:user', {
        calories: 200,
        totalFat: 6500,
        saturatedFat: 2000,
        transFat: 200,
        polyunsaturatedFat: -1,
        monounsaturatedFat: -1,
        totalCarbohydrate: 30000,
        sugar: 5000,
        fiber: 2800,
        protein: 5000,
        cholesterol: 30,
        sodium: 240
      } as INutritionData);

  }

  public navItems: any[] = NAV_ITEMS;
}
