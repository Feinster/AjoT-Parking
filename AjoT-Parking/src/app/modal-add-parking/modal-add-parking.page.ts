import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-add-parking',
  templateUrl: './modal-add-parking.page.html',
  styleUrls: ['./modal-add-parking.page.scss'],
})
export class ModalAddParkingPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() { }

  close() {
    this.modalCtrl.dismiss();
  }

  numericOnly(event: any): boolean {
    let pattern = /^([0-9])$/;
    let result = pattern.test(event.key);
    return result;
  }
}
