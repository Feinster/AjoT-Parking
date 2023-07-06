import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalInfoPage } from '../modal-info/modal-info.page';

@Component({
  selector: 'app-stalls-management',
  templateUrl: './stalls-management.page.html',
  styleUrls: ['./stalls-management.page.scss'],
})
export class StallsManagementPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {  }

  openModalInfo():void{
    this.presentModal();
  }

  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: ModalInfoPage,
    });
    await modal.present();
  }

}
