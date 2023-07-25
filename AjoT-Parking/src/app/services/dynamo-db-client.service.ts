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

  getSensorValuesByIdAndMacAndTime(id: number, MAC: string, startTime: number, endTime: number): Observable<any> {
    const url = `${this.baseUrl}/api/getSensorValuesByIdAndMacAndTime?id=${id}&MAC=${MAC}&startTime=${startTime}&endTime=${endTime}`;
    return this.http.get(url);
  }
}
