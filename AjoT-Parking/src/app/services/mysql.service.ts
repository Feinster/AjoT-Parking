import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MysqlService {

  private baseUrl = 'http://localhost:3000'; // back-end url

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
    const url = `${this.baseUrl}/api/userRegistration`;

    const requestBody = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(url, requestBody, httpOptions);
  }

  parkingInsertion(MAC: string, city: string, address: string, location: string, nStalls: number, isOpen: boolean, img: string, brightnessThreshold: number): Observable<any> {
    const url = `${this.baseUrl}/api/parkingInsertion`;

    const requestBody = {
      MAC: MAC,
      city: city,
      address: address,
      location: location,
      nStalls: nStalls,
      isOpen: isOpen,
      img: img,
      brightnessThreshold: brightnessThreshold
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(url, requestBody, httpOptions);
  }

  getStallsByParkingMAC(MAC: string): Observable<any> {
    const url = `${this.baseUrl}/api/stalls?MAC=${MAC}`;
    return this.http.get(url);
  }

  getParkingByMAC(MAC: string): Observable<any> {
    const url = `${this.baseUrl}/api/parkingByMAC?MAC=${MAC}`;
    return this.http.get(url);
  }

  stallInsertion(id: number, GPIO: number, MAC_PARKING: string, isFree: boolean): Observable<any> {
    const url = `${this.baseUrl}/api/stallInsertion`;

    const requestBody = {
      id: id,
      GPIO: GPIO,
      MAC_PARKING: MAC_PARKING,
      isFree: isFree
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(url, requestBody, httpOptions);
  }

  countNStalls(MAC: string): Observable<any> {
    const url = `${this.baseUrl}/api/countNStalls?MAC=${MAC}`;
    return this.http.get(url);
  }

  changeStatusParking(MAC: string, newStatus: boolean): Observable<any> {
    const url = `${this.baseUrl}/api/changeStatusParking`;

    const requestBody = {
      MAC: MAC,
      newStatus: newStatus
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(url, requestBody, httpOptions);
  }

  deleteStall(MAC: string, id: number): Observable<any> {
    const url = `${this.baseUrl}/api/deleteStall`;

    const requestBody = {
      MAC: MAC,
      id: id
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(url, requestBody, httpOptions);
  }

  changeNumberOfStalls(MAC: string, newNStalls: number): Observable<any> {
    const url = `${this.baseUrl}/api/changeNumberOfStalls`;

    const requestBody = {
      MAC: MAC,
      newNStalls: newNStalls
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(url, requestBody, httpOptions);
  }

  changeBrightnessThreshold(MAC: string, newBrightnessThreshold: number): Observable<any> {
    const url = `${this.baseUrl}/api/changeBrightnessThreshold`;

    const requestBody = {
      MAC: MAC,
      newBrightnessThreshold: newBrightnessThreshold
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(url, requestBody, httpOptions);
  }
}