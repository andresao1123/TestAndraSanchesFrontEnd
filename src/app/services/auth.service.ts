import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { User } from '../models/User';
import { ErrorHandlerServiceService } from './error-handler-service.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = environment.apiUrl;

  isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
  userId!: Pick<User, 'id'>;

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private http: HttpClient,
    private errorHadlerService: ErrorHandlerServiceService,
    private router: Router
  ) {}

  login(
    name: Pick<User, 'name'>,
    password: Pick<User, 'password'>
  ): Observable<{ token: string; userId: Pick<User, 'id'> }> {
    return new Observable<{ token: string; userId: Pick<User, 'id'> }>(
      (observer) => {
        const xhr = new XMLHttpRequest();

        xhr.open('POST', `${this.url}/auth/login`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function () {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
              const tokenObject = JSON.parse(xhr.responseText);
              observer.next(tokenObject);
              observer.complete();
            } else {
              observer.error(xhr.statusText);
            }
          }
        };

        xhr.send(JSON.stringify({ name, password }));
      }
    ).pipe(
      first(),
      tap((tokenObject: { token: string; userId: Pick<User, 'id'> }) => {
        this.userId = tokenObject.userId;
        localStorage.setItem('token', tokenObject.token);
        this.isUserLoggedIn$.next(true);
        this.router.navigate(['paymentForm']);
      }),
      catchError(
        this.errorHadlerService.handleError<{
          token: string;
          userId: Pick<User, 'id'>;
        }>('login')
      )
    );
  }
  logout(): void {
    this.clearAllTokens();
    // Clear authentication-related information
    localStorage.removeItem('token');

    // Update application state
    this.isUserLoggedIn$.next(false);

    // Navigate to the login page or another appropriate route
    this.router.navigate(['home']);
  }

  private clearAllTokens() {
    localStorage.clear();
    sessionStorage.clear();
  }
}
