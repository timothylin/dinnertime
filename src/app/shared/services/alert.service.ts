import { AlertOptions } from '../models/alert-options';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as $ from 'jquery';

// Webpack Imports
import 'bootstrap-notify/bootstrap-notify.js';

@Injectable()
export class AlertService {

  private config: any = {
    delay: 5000,
    offset: {
      x: 10,
      y: 48
    },
    element: 'body',
    placement: {
      from: 'bottom',
      align: 'right'
    },
    animate: {
      enter: 'animated fadeInUp',
      exit: 'animated fadeOutRight'
    }
  };

  private formatOptions(options: AlertOptions): AlertOptions {
    options.title = '<strong>' + options.title + '</strong>';
    options.message = '<p>' + options.message + '</p>';
    return options;
  }

  public toastWarn(title: string, message: string): void {
    $['notify'](this.formatOptions(new AlertOptions(title, message)), _.extend(this.config, {
      type: 'warning'
    }));
  }

  public toastError(title: string, message: string): void {
    $['notify'](this.formatOptions(new AlertOptions(title, message)), _.extend(this.config, {
      type: 'danger'
    }));
  }

  public toastSuccess(title: string, message: string): void {
    $['notify'](this.formatOptions(new AlertOptions(title, message)), _.extend(this.config, {
      type: 'success'
    }));
  }
}
