import { AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

export class PageComponentBase implements AfterViewInit {

  private _title: Title;

  constructor() {
    this._title = new Title(null);
  }

  public title: string;

  public ngAfterViewInit() {
    const titleSuffix = 'Recipe Catalog';
    if (this.title) {
      this._title.setTitle(this.title + ' | ' + titleSuffix);
    }
    else {
      this._title.setTitle(titleSuffix);
    }
  }
}
