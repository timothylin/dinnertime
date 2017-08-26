import { PageComponentBase } from '../shared/page-component-base';
import { Component } from '@angular/core';

@Component({
  templateUrl: './dashboard.html'
})

export class DashboardComponent extends PageComponentBase {

  public videoBackground: string;

  constructor() {
    super();

    const videos: string[] = [
      'main1.webm',
      'main2.webm',
      'main3.webm',
      'main4.webm'
    ];

    this.videoBackground = videos[Math.floor(Math.random() * videos.length)];
  }
}
