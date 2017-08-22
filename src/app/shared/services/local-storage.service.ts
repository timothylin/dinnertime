import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
  public get<T>(key: string): T {
    return JSON.parse(localStorage.getItem(this.getFQK(key))) as T;
  }

  public set<T>(key: string, data: T): void {
    localStorage.setItem(this.getFQK(key), JSON.stringify(data));
  }

  public remove(key: string): void {
    localStorage.removeItem(this.getFQK(key));
  }

  public getFQK(key: string): string {
    return 'dinnertime:' + key;
  }
}
