import { Component } from '@angular/core';
import { WebSocketService } from './services/web-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  //AppComponent is the first component that is loaded, instantiating here the websocket is immediately opened
  constructor(private webSocketService: WebSocketService) { }
}
