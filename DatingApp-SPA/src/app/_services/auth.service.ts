import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, retryWhen, catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from './../../environments/environment';
import { fromEvent, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  constructor(private http: HttpClient) { }
  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model).pipe(
      retryWhen(() => fromEvent(window, 'online')),
      tap((response: any) => {
        const user = response;
        if (user) {
          localStorage.setItem('token', user.token);
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
        }
      }),
      catchError(error => of(error))
    );
  }
  register(model: any) {
    return this.http.post(this.baseUrl + 'register', model).pipe(
      retryWhen(() => fromEvent(window, 'online')),
      catchError(error => of(error))
    );
  }
  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }
}
