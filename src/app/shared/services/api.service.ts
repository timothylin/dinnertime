import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { LocalStorageService } from './local-storage.service';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiService {

  public baseUrl: string;

  constructor(
    private _http: Http,
    private _localStorageService: LocalStorageService
  ) {
    this.baseUrl = 'http://localhost:5000/';
  }

  public get<T>(url: string): Observable<T> {
    return this._intercept(
      this._http.get(this.baseUrl + url, {
          headers: this._getHeaders(url)
        })
        .first())
        .map((res) => res.json() as T);
  }

  public post<TRequest, TResponse>(url: string, data: TRequest): Observable<TResponse> {
    return this._intercept(
      this._http.post(this.baseUrl + url, JSON.stringify(data), {
        headers: this._getHeaders(url)
      })
      .first())
      .map((res) => res.json() as TResponse);
  }

  public put<TRequest, TResponse>(url: string, data: TRequest): Observable<TResponse> {
    return this._intercept(
      this._http.put(this.baseUrl + url, JSON.stringify(data), {
        headers: this._getHeaders(url)
      })
      .first())
      .map((res) => res.json() as TResponse);
  }

  public patch<TRequest, TResponse>(url: string, data: any): Observable<TResponse> {
    return this._intercept(
      this._http.patch(this.baseUrl + url, JSON.stringify(data), {
        headers: this._getHeaders(url)
      })
      .first())
      .map((res) => res.json() as TResponse);
  }

  public delete<T>(url: string): Observable<T> {
    return this._intercept(
      this._http.delete(this.baseUrl + url, {
        headers: this._getHeaders(url)
      })
      .first())
      .map((res) => res.json() as T);
  }

  public _intercept<T>(response: Observable<T>): Observable<T> {
    return response.catch((err) => {
      if (err.status === 401) {
        // TODO: Implement login redirects
      }
      return Observable.throw(err);
    });
  }

  public _getHeaders(url: string): Headers {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');

    if (url.indexOf('auth') === -1) {
      const token = this._localStorageService.get('auth-token');
      if (token !== null) {
        headers.append('Authorization', 'DT-OAUTH ' + token);
      }
    }

    return headers;
  }
}
