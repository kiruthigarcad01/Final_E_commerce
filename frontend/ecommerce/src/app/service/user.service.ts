import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) { }

  registerUser(userData: any): Observable<any> {
    return this.http.post(environment.apiUrl + '/api/v1/create-employee', userData);
  }
  
  loginUser(userData: any): Observable<any> {
    return this.http.post(environment.apiUrl + '/api/v1/login', userData);
  }

  getCustomerData(): Observable<any> {
    return this.http.get(environment.apiUrl + '/api/v1/getCustomers');
  }
}
