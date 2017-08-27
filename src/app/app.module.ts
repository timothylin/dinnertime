import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule, ApplicationRef } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import {
  removeNgStyles,
  createNewHosts,
  createInputTransfer
} from '@angularclass/hmr';

import { ENV_PROVIDERS } from './environment';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';
import { AppPreloader } from './app.loader';

import { DashboardComponent } from './dashboard/dashboard.component';
import { IngredientListComponent } from './ingredients/ingredient-list.component';
import { IngredientDetailComponent } from './ingredients/ingredient-detail.component';
import { RecipeListComponent } from './recipes/recipe-list.component';
import { RecipeDetailComponent } from './recipes/recipe-detail.component';
import { NutritionFactsComponent } from './shared/components/nutrition-facts.component';
import { DataTableComponent } from './shared/components/data-table.component';
import { FilterBarComponent } from './shared/components/filter-bar.component';
import { LoadingComponent } from './shared/components/loading.component';
import { UserSummaryComponent } from './shared/components/user-summary.component';

import { UnitPipe } from './shared/pipes/unit.pipe';
import { KeysPipe } from './shared/pipes/keys.pipe';

import { AlertService } from './shared/services/alert.service';
import { ApiService } from './shared/services/api.service';
import { ConversionService } from './shared/services/conversion.service';
import { DataService } from './shared/services/data.service';
import { LocalStorageService } from './shared/services/local-storage.service';
import { IngredientService } from './shared/services/ingredient.service';
import { RecipeService } from './shared/services/recipe.service';
import { IdentityService } from './shared/services/identity.service';

// NOTE: These are Webpack imports, not TypeScript.
import '../styles/main.scss';

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState
];

export interface StoreType {
  state: InternalStateType;
  restoreInputValues: () => void;
  disposeOldHosts: () => void;
}

const ROUTES: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'ingredients', component: IngredientListComponent },
  { path: 'ingredients/:ingredientId', component: IngredientDetailComponent },
  { path: 'recipes', component: RecipeListComponent },
  { path: 'recipes/:recipeId', component: RecipeDetailComponent }
];

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    DashboardComponent,
    IngredientDetailComponent,
    IngredientListComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    NutritionFactsComponent,
    DataTableComponent,
    FilterBarComponent,
    LoadingComponent,
    UserSummaryComponent,
    UnitPipe,
    KeysPipe
  ],
  imports: [
    HttpModule,
    RouterModule,
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(ROUTES, { preloadingStrategy: AppPreloader }),
    NgbModule.forRoot()
  ],
   providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS,
    AppPreloader,
    AlertService,
    ApiService,
    ConversionService,
    DataService,
    LocalStorageService,
    IngredientService,
    RecipeService,
    IdentityService
  ]
})
export class AppModule {
  constructor(
    public appRef: ApplicationRef,
    public appState: AppState) {}

  public hmrOnInit(store: StoreType) {
    if (!store || !store.state) {
      return;
    }
    // set state
    this.appState._state = store.state;
    // set input values
    if ('restoreInputValues' in store) {
      const restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  public hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    // save state
    const state = this.appState._state;
    store.state = state;
    // recreate root elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // save input values
    store.restoreInputValues  = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  public hmrAfterDestroy(store: StoreType) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
