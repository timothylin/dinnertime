import { Component, AfterContentInit } from '@angular/core';
import { IdentityService } from '../services/identity.service';

declare var FB: any;

@Component({
  selector: 'user-summary',
  templateUrl: 'user-summary.html'
})

export class UserSummaryComponent implements AfterContentInit {

  constructor(public identityService: IdentityService) {
  }

  public ngAfterContentInit(): void {
    this.identityService.init();
  }

  public login(): void {
    this.identityService.login();
  }

  public logout(): void {
    this.identityService.logout();
  }
}
