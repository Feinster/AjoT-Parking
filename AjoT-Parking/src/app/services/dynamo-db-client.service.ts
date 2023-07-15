import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DynamoDbClientService {

  private baseUrl = 'http://localhost:3000'; // back-end url

  constructor(private http: HttpClient) { }

  getSensorValues(): Observable<any> {
    const url = `${this.baseUrl}/api/sensorValues`;
    return this.http.get(url);
  }

}
