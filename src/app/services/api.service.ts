import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { ErrorHandlerServiceService } from './error-handler-service.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';


interface ApiResponse {
  result: any; // Replace 'any' with the actual type of the 'result' attribute
  // Add other properties if your API response has them
}

@Injectable({
  providedIn: 'root',
})

export class ApiService {
  private url = environment.apiUrl;

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private http: HttpClient,
    private errorHadlerService: ErrorHandlerServiceService,
    private router: Router
  ) {}

  async checkTransactionStatus(date:any,amount:any,token:any,idNumber:string) {
    try {
      const response = await firstValueFrom(this.http.post(`${this.url}/api/checkTransactionStatus`, { date, amount, token }, this.httpOptions));
      return response;
      console.log('API Response:', response);
  
      // You can do more with the response here
    } catch (error) {
      console.error('Error making API call:', error);
      return error;
      // You can do more with the error here
    }
  }

  async getPaymentHistory(documentId:string|null):Promise<any>{
    try{
      const response = await firstValueFrom(this.http.post<ApiResponse>(`${this.url}/api/getPaymentHistory`, { documentId }, this.httpOptions));
      
      return response.result;
    }
    catch (error) {
      console.error('Error making API call:', error);
      return(error);
      // You can do more with the error here
    }
  }
}
