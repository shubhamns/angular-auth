import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { User } from '../models/user';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  private handleError(error: any) {
    return throwError(error.error);
  }

  registerUser(user: User): Observable<any> {
    return this.httpClient
      .post<User[]>(environment.API_URL + `/api/v1/user/signup`, user)
      .pipe(catchError(this.handleError));
  }

  userMe(): Observable<any> {
    return this.httpClient
      .get<User[]>(environment.API_URL + `/api/v1/user/me`)
      .pipe(catchError(this.handleError));
  }
}
