import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, fromEvent, of } from 'rxjs';
import { User } from '../_models/user';
import { retryWhen, catchError, map } from 'rxjs/operators';
import { PaginatedResult } from '../_models/pagination';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsers(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<User[]>> {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
    let params = new HttpParams();
    if (page !== null && itemsPerPage !== null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    if (userParams) {
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);
    }
    return this.http.get<User[]>(this.baseUrl + 'users', {
      observe: 'response',
      params
    }).pipe(
      map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      }),
      retryWhen(() => fromEvent(window, 'online')),
      catchError(error => of(error))
    );
  }

  getUser(id): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'users/' + id).pipe(
      retryWhen(() => fromEvent(window, 'online')),
      catchError(error => of(error))
    );
  }

  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + 'users/' + id, user);
  }

  setMainPhoto(userId: number, id: number) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {});
  }

  deletePhoto(userId: number, id: number) {
    return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + id);
  }

  sendLike(id: number, recipientId: number) {
    return this.http.post(this.baseUrl + 'users/' + id + '/like/' + recipientId, {});
  }
}
