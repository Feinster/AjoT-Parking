import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalInfoPage } from '../modal-info/modal-info.page';
import { ActivatedRoute, Router } from '@angular/router';
import { MysqlService } from '../services/mysql.service';
import { Stall } from '../models/Stall';
import { Parking } from '../models/Parking';
import { ModalAddStallPage } from '../modal-add-stall/modal-add-stall.page';

@Component({
  selector: 'app-stalls-management',
  templateUrl: './stalls-management.page.html',
  styleUrls: ['./stalls-management.page.scss'],
})
export class StallsManagementPage implements OnInit {

  MAC: string = "";
  stallsArray: Stall[] = [];
  parking: Parking | undefined;

  constructor(private modalCtrl: ModalController, private route: ActivatedRoute, private mysqlService: MysqlService) { }

  ngOnInit() { }

  ionViewWillEnter() {
    const param = this.route.snapshot.queryParamMap.get('MAC');
    this.MAC = param !== null ? param : "";
    console.log('MAC value:', this.MAC);
    this.getStalls(this.MAC);
    this.getParkingByMac(this.MAC);
  }

  openModalInfo(): void {
    this.presentModalInfo();
  }

  async presentModalInfo() {
    const modal = await this.modalCtrl.create({
      component: ModalInfoPage,
    });
    await modal.present();
  }

  getStalls(MAC: string): void {
    this.stallsArray = [];
    this.mysqlService.getStallsByParkingMAC(MAC).subscribe({
      next: (response) => {
        if (response.length > 0) {
          console.log('Stalls found');
          response.forEach((stallJson: any) => {
            const stall = new Stall(
              stallJson.id,
              stallJson.GPIO,
              stallJson.MAC_parking,
              stallJson.isFree === 1 ? true : false
            );
            this.stallsArray.push(stall);
          });
        } else {
          console.log('No stalls found');
        }
      },
      error: (e) => console.error('Error searching stalls', e)
    });
  }

  getParkingByMac(MAC: string) {
    this.mysqlService.getParkingByMAC(MAC).subscribe({
      next: (response) => {
        if (response.length > 0) {
          console.log('Parking found', response);
          response.forEach((parkingJson: any) => {
            this.parking = new Parking(
              parkingJson.MAC,
              parkingJson.city,
              parkingJson.address,
              parkingJson.location,
              parkingJson.nStalls,
              parkingJson.isOpen === 1 ? true : false,
              parkingJson.img,
              parkingJson.occupiedStalls
            );
          });
        } else {
          console.log('No parking found');
        }
      },
      error: (e) => console.error('Errore searching parking', e)
    });
  }

  openModalAddStall(): void {
    this.presentModalAddStall(this.MAC);
  }

  async presentModalAddStall(MAC: string) {
    const modal = await this.modalCtrl.create({
      component: ModalAddStallPage,
      componentProps: { 'MAC': MAC }
    });

    modal.onDidDismiss().then((data) => {
      this.getStalls(this.MAC);
      this.getParkingByMac(this.MAC);
    });

    await modal.present();
  }

  changeStatusParking() {
    this.mysqlService.changeStatusParking(this.MAC, !this.parking?.isOpen).subscribe({
      next: (response) => {
        if (response.affectedRows > 0) {
          console.log('Parking changed', response);
        } else {
          console.log('No change or parking not found', response);
        }
      },
      error: (e) => console.error('Errore changing parking', e)
    });

    this.getParkingByMac(this.MAC);
  }

  deleteStall(id: number) {
    this.mysqlService.deleteStall(this.MAC, id).subscribe({
      next: (response) => {
        if (response.affectedRows > 0) {
          console.log('stall deleted', response);
        } else {
          console.log('No stall found', response);
        }
      },
      error: (e) => console.error('Errore deleting stall', e)
    });

    this.getStalls(this.MAC);
    this.getParkingByMac(this.MAC);
  }

}
