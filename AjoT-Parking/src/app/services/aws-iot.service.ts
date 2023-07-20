import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AwsIotService {

  private baseUrl = 'http://localhost:3000'; // back-end url

  constructor(private http: HttpClient) { }

  getThingShadow(MAC: string): Observable<any> {
    const url = `${this.baseUrl}/api/getThingShadow?MAC=${MAC}`;
    return this.http.get(url);
  }

  updateThingShadow(MAC: string, body: any): Observable<any> {
    const url = `${this.baseUrl}/api/updateThingShadow`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    const data = { MAC: MAC, body: body };
    return this.http.post(url, data, httpOptions);
  }

  subscribeStatus(MAC: string): Observable<any> {
    const url = `${this.baseUrl}/api/subscribeStatus?MAC=${MAC}`;
    return this.http.get(url);
  }
}
