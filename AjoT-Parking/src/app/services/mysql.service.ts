import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MysqlService {

  private baseUrl = 'http://localhost:3000'; // L'URL del tuo backend

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {
    const url = `${this.baseUrl}/api/users`;
    return this.http.get(url);
  }

  getParking(): Observable<any> {
    const url = `${this.baseUrl}/api/parking`;
    return this.http.get(url);
  }

  getUsersByEmailAndPassword(email: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/api/user?email=${email}&password=${password}`;
    return this.http.get(url);
  }

  userRegistration(firstName: string, lastName: string, email: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/api/userRegistration?firstName=${firstName}&${lastName}&email=${email}&password=${password}`;
    return this.http.get(url);
  }
}