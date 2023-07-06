import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ModalAddParkingPage } from '../modal-add-parking/modal-add-parking.page';

@Component({
  selector: 'app-parking',
  templateUrl: './parking.page.html',
  styleUrls: ['./parking.page.scss'],
})
export class ParkingPage implements OnInit {

  constructor(private router: Router, private modalCtrl: ModalController) { }

  ngOnInit() { }

  openStallsManagement(): void {
    this.router.navigate(['/stalls-management']);
  }

  openModalAddParking():void{
    this.presentModal();
  }

  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: ModalAddParkingPage,
    });
    await modal.present();
  }
}
