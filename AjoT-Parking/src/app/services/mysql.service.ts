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
    const url = `${this.baseUrl}/api/userRegistration?firstName=${firstName}&lastName=${lastName}&email=${email}&password=${password}`;
    return this.http.get(url);
  }

  parkingInsertion(MAC: string, city: string, address: string, location: string, nStalls: number, isOpen: boolean, img: string): Observable<any> {
    const url = `${this.baseUrl}/api/parkingInsertion?MAC=${MAC}&city=${city}&address=${address}&location=${location}&nStalls=${nStalls}&isOpen=${isOpen}&img=${img}`;
    return this.http.get(url);
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
    const url = `${this.baseUrl}/api/stallInsertion?id=${id}&GPIO=${GPIO}&MAC_PARKING=${MAC_PARKING}&isFree=${isFree}`;
    return this.http.get(url);
  }

  changeStatusParking(MAC: string, newStatus: boolean): Observable<any> {
    const url = `${this.baseUrl}/api/changeStatusParking?MAC=${MAC}&newStatus=${newStatus}`;
    return this.http.get(url);
  }

  deleteStall(MAC: string, id: number): Observable<any> {
    const url = `${this.baseUrl}/api/deleteStall?MAC=${MAC}&id=${id}`;
    return this.http.get(url);
  }
}