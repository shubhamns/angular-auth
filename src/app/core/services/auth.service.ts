import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { JwtService } from '../jwt/jwt.service';
import { User } from '../models/user';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private httpClient: HttpClient, private _jwtService: JwtService) {
    this.currentUserSubject = new BehaviorSubject<User>(
      window.localStorage['jwtToken']
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  private handleError(error: any) {
    return throwError(error);
  }

  setAuth(user: User) {
    this._jwtService.saveToken(user.token);
    this.currentUserSubject.next(user);
  }

  loginUser(user: User): Observable<any> {
    return this.httpClient
      .post<User>(environment.API_URL + `/api/v1/user/signin`, user)
      .pipe(
        map((user) => {
          this.setAuth(user);
          return user;
        }),
        catchError(this.handleError)
      );
  }

  logout() {
    this._jwtService.destroyToken();
    this.currentUserSubject.next(null as unknown as User);
  }
}
