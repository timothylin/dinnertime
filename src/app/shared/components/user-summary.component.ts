import { Component, AfterContentInit } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import { ApiService } from '../services/api.service';
import { User } from '../models/user';

declare var FB: any;

@Component({
  selector: 'user-summary',
  templateUrl: 'user-summary.html'
})

export class UserSummaryComponent implements AfterContentInit {

  constructor(private _localStorageService: LocalStorageService, private _apiService: ApiService) {
  }

  public isLoggedIn: boolean = false;
  public userName: string;
  public userPhotoUrl: string;

  public ngAfterContentInit(): void {
    FB.getLoginStatus((response) => {
      if (response.status === 'unknown') {
        // User is not logged into facebook, unknown authorization
        this.isLoggedIn = false;
      }
      else if (response.status === 'not_authorized') {
        // User is logged into facebook, but has NOT authorized the app
        this.isLoggedIn = false;
      }
      else if (response.status === 'connected') {
        // User is logged into facebook and has authorized the app
        this.isLoggedIn = true;
        this._localStorageService.set('user.accessToken', response.authResponse.accessToken);
        this._localStorageService.set('user.id', response.authResponse.userID);
        this.initIdentity();
      }
    });
  }

  private initIdentity(): void {
    FB.api('/me', (user) => {
      this._localStorageService.set('user.name', user.name);
      this.userName = user.name;
      this.userPhotoUrl = 'http://graph.facebook.com/' + user.id + '/picture?type=normal';

      this._apiService.put<User, User>('users/' + user.id, user).subscribe((data) => {
        console.log(data);
      });
    });
  }

  public login(): void {
    FB.login((response) => {
      this._localStorageService.set('user.accessToken', response.authResponse.accessToken);
      this._localStorageService.set('user.id', response.authResponse.userID);
      if (response.status === 'connected') {
        this.isLoggedIn = true;
        this.initIdentity();
      }
    }, { scope: 'public_profile' });
  }

  public logout(): void {
    FB.logout((response) => {
      this.isLoggedIn = false;
      this._localStorageService.remove('user.authToken');
      this._localStorageService.remove('user.name');
      this._localStorageService.remove('user.id');
   });
  }
}
