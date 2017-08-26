import { AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

export class PageComponentBase implements AfterViewInit {

  private _title: Title;

  constructor() {
    this._title = new Title(null);
  }

  public title: string;

  public ngAfterViewInit() {
    if (this.title) {
      this._title.setTitle(this.title + ' | DinnerTime');
    }
    else {
      this._title.setTitle('DinnerTime - A Nutrition-Based Meal Planning Tool');
    }
  }
}
