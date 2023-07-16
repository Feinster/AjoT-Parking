import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalInfoPage } from '../modal-info/modal-info.page';
import { ActivatedRoute, Router } from '@angular/router';
import { MysqlService } from '../services/mysql.service';
import { Stall } from '../models/Stall';
import { Parking } from '../models/Parking';
import { ModalAddStallPage } from '../modal-add-stall/modal-add-stall.page';
import { DynamoDbClientService } from '../services/dynamo-db-client.service';
import { SensorValue } from '../models/SensorValue';

@Component({
  selector: 'app-stalls-management',
  templateUrl: './stalls-management.page.html',
  styleUrls: ['./stalls-management.page.scss'],
})
export class StallsManagementPage implements OnInit {

  MAC: string = "";
  stallsArray: Stall[] = [];
  parking: Parking | undefined;
  sensorValuesArray: SensorValue[] = [];

  constructor(private modalCtrl: ModalController, private route: ActivatedRoute, private mysqlService: MysqlService, private dynamoService: DynamoDbClientService) { }

  ngOnInit() { }

  ionViewWillEnter() {
    const param = this.route.snapshot.queryParamMap.get('MAC');
    this.MAC = param !== null ? param : "";
    console.log('MAC value:', this.MAC);
    this.getStalls(this.MAC);
    this.getParkingByMac(this.MAC);
  }

  openModalInfo(id: number): void {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const time = currentDate.getTime() * 1000;
    this.getSensorValuesByIdAndMacAndTime(id, time);
  }

  async presentModalInfo(brightness: any) {
    console.log("brightness:", brightness)
    const modal = await this.modalCtrl.create({
      component: ModalInfoPage,
      componentProps: { 'brightness': brightness }
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

  getSensorValuesByIdAndMacAndTime(id: number, time: number): void {
    this.dynamoService.getSensorValuesByIdAndMacAndTime(id, this.MAC, time).subscribe({
      next: (response) => {
        if (response.Count > 0) {
          const itemsArray = response.Items;
          this.sensorValuesArray = itemsArray.map((item: any) => {
            return new SensorValue(
              item.brightness_value,
              item.MAC_address,
              item.stall_id,
              item.time_microseconds,
            );
          });
          console.log(this.sensorValuesArray);
        
          const averageBrightnessPerHour = SensorValue.calculateAverageBrightnessPerHour(this.sensorValuesArray);
          console.log(averageBrightnessPerHour);
          const brightness = averageBrightnessPerHour.map((sensor) => sensor.averageBrightness);
          this.presentModalInfo(brightness);

        } else {
          console.log('No sensor values');
        }
      },
      error: (e) => console.error('Error getting sensor values:', e)
    });
  }

}
