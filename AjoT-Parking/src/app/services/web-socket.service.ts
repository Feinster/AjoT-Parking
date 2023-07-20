import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket;
  private dataSubject: Subject<any> = new Subject<any>();

  constructor() {
    this.socket = new WebSocket('ws://localhost:8080');

    this.socket.onmessage = (event) => {
      const data = event.data;
      this.dataSubject.next(data); // Notify subscribers with received data
    };

    this.socket.onerror = (error) => {
      this.dataSubject.error(error);
    };

    this.socket.onclose = () => {
      this.dataSubject.complete();
    };
  }

  getData(): Observable<any> {
    return this.dataSubject.asObservable();
  }

  sendData(data: any) {
    this.socket.send(JSON.stringify(data));
  }
}
