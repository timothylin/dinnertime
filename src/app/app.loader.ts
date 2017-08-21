import { PreloadingStrategy, Route } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

export class AppPreloader implements PreloadingStrategy {
  public preload(route: Route, load: () => void): Observable<any> {
    return Observable.of(null);
  }
}
