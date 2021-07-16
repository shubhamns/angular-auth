import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtService } from '../../jwt/jwt.service';

@Injectable({
  providedIn: 'root',
})
export class BasicAuthInterceptor implements HttpInterceptor {
  headersConfig: any;

  constructor(private jwtService: JwtService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.body instanceof FormData) {
      this.headersConfig = {
        Accept: 'application/json',
      };
    } else {
      this.headersConfig = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };
    }
    const token = this.jwtService.getToken();
    if (token) {
      this.headersConfig['Authorization'] = `Bearer ${token}`;
    }
    const request = req.clone({ setHeaders: this.headersConfig });
    return next.handle(request);
  }
}
