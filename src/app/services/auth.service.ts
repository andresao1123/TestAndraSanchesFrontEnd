import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import axios from 'axios';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { User } from '../models/User';
import { ErrorHandlerServiceService } from './error-handler-service.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { NavigationComponent } from '../components/navigation/navigation.component';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.appModeProd ? environment.apiUrl : environment.apiUrlDev;
  

  isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
  userId!: Pick<User, 'id'>;

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }),
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
    const loginUrl = `${this.apiUrl}/auth/login`;

    // Set CORS headers
    const headers = {
      'Content-Type': 'application/json',
      // 'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization' // Update this to the actual origin if needed
      // Add other CORS headers if necessary
    };

    const body = { name, password };

    return new Observable<{ token: string; userId: Pick<User, 'id'> }>(
      (observer) => {
        axios
          .post<{ token: string; userId: Pick<User, 'id'> }>(loginUrl, body, {
            headers,
            withCredentials: true,
          })
          .then((response) => {
            observer.next(response.data);
            observer.complete();
          })
          .catch((error) => {
            observer.error(error);
          });
      }
    ).pipe(
      first(),
      tap((tokenObject: { token: string; userId: Pick<User, 'id'> }) => {
        this.userId = tokenObject.userId;
        localStorage.setItem('token', tokenObject.token);
        this.isUserLoggedIn$.next(true);
        this.router.navigate(['paymentForm']);
      }),
      catchError((error: any) => {
        // Handle login error
        return this.errorHandler(error);
      })
    );
  }

  get isLoggedIn() {
    return this.isUserLoggedIn$.asObservable();
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

  private errorHandler(error: any): Observable<never> {
    // Implement your error handling logic
    console.error('Error occurred:', error);
    throw error;
  }

  private clearAllTokens() {
    localStorage.clear();
    sessionStorage.clear();
  }
}
