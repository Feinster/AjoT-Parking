import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ModalAddParkingPage } from '../modal-add-parking/modal-add-parking.page';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-parking',
  templateUrl: './parking.page.html',
  styleUrls: ['./parking.page.scss'],
})
export class ParkingPage implements OnInit {

  constructor(private router: Router, private modalCtrl: ModalController, public userService: UserService) { }

  ngOnInit() { }

  openStallsManagement(): void {
    if (this.userService.isUserAdmin()) {
      this.router.navigate(['/stalls-management']);
    }
  }

  openModalAddParking(): void {
    this.presentModal();
  }

  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: ModalAddParkingPage,
    });
    await modal.present();
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
