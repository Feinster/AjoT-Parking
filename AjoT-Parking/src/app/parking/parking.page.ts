import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ModalAddParkingPage } from '../modal-add-parking/modal-add-parking.page';
import { UserService } from '../services/user.service';
import { Parking } from '../models/Parking';
import { MysqlService } from '../services/mysql.service';

@Component({
  selector: 'app-parking',
  templateUrl: './parking.page.html',
  styleUrls: ['./parking.page.scss'],
})
export class ParkingPage implements OnInit {

  parkingArray: Parking[] = [];

  constructor(private router: Router, private modalCtrl: ModalController, public userService: UserService, private mysqlService: MysqlService) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.getParking();
  }

  openStallsManagement(MAC: string): void {
    if (this.userService.isUserAdmin()) {
      this.router.navigate(['/stalls-management'], { queryParams: { MAC: MAC } });
    }
  }

  openModalAddParking(): void {
    this.presentModalAddParking();
  }

  async presentModalAddParking() {
    const modal = await this.modalCtrl.create({
      component: ModalAddParkingPage,
    });

    modal.onDidDismiss().then((data) => {
      this.getParking();
    });

    await modal.present();
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

  getParking(): void {
    this.mysqlService.getParking().subscribe({
      next: (response) => {
        if (response.length > 0) {
          console.log('Parking found', response);
          response.forEach((parkingJson: any) => {
            const parking = new Parking(
              parkingJson.MAC,
              parkingJson.city,
              parkingJson.address,
              parkingJson.location,
              parkingJson.nStalls,
              parkingJson.isOpen === 1 ? true : false,
              parkingJson.img,
              parkingJson.availableStalls
            );
            if (!this.parkingArray.some((item) => item.equals(parking))) {
              this.parkingArray.push(parking);
            }
          });
        } else {
          console.log('No parking found');
        }
      },
      error: (e) => console.error('Errore searching parking', e)
    });
  }
}
