import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ModalInfoPage } from '../modal-info/modal-info.page';
import { ActivatedRoute, Router, } from '@angular/router';
import { MysqlService } from '../services/mysql.service';
import { Stall } from '../models/Stall';
import { Parking } from '../models/Parking';
import { ModalAddStallPage } from '../modal-add-stall/modal-add-stall.page';
import { DynamoDbClientService } from '../services/dynamo-db-client.service';
import { SensorValue } from '../models/SensorValue';
import { AwsIotService } from '../services/aws-iot.service';
import { WebSocketService } from '../services/web-socket.service';
import { Subscription } from 'rxjs';
import { ModalChangeNumberStallsPage } from '../modal-change-number-stalls/modal-change-number-stalls.page';
import { ModalChangeBrightnessThresholdPage } from '../modal-change-brightness-threshold/modal-change-brightness-threshold.page';
import { ModalChooseDataPage } from '../modal-choose-data/modal-choose-data.page';

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

  private socketSubscription: Subscription = new Subscription;

  constructor(private modalCtrl: ModalController, private route: ActivatedRoute, private mysqlService: MysqlService, private loadingController: LoadingController,
    private dynamoService: DynamoDbClientService, private toastController: ToastController, private aws: AwsIotService, 
    private ws: WebSocketService, private router: Router) { }

  ngOnInit() {
    // Subscribe to the service observable to receive data from the server
    this.socketSubscription = this.ws.getData().subscribe((data) => {
      console.log(data);
      if (data === 'update_status') {
        this.getStalls(this.MAC);
        this.getParkingByMac(this.MAC);
      }
    });
  }

  ngOnDestroy() {
    // Unsubscribe when page is destroyed to avoid memory leaks
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
  }

  ionViewWillEnter() {
    const param = this.route.snapshot.queryParamMap.get('MAC');
    this.MAC = param !== null ? param : "";
    console.log('MAC value:', this.MAC);
    this.getStalls(this.MAC);
    this.getParkingByMac(this.MAC);

    this.aws.subscribeStatus(this.MAC).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (e) => console.error('Error in subscribeStatus', e)
    });
  }

  openModalTodaysInfo(id: number): void {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const startTime = currentDate.getTime() * 1000;

    currentDate.setHours(23, 59, 59, 999);
    const endTime = currentDate.getTime() * 1000;
    this.getSensorValuesByIdAndMacAndTime(id, startTime, endTime);
  }

  openModalSearchInfo(id: number): void {
    this.presentModalChooseDate(this.MAC, id);
  }

  async presentModalTodaysInfo(brightness: any, id: number, belowThresholdAfterExceedancePerHour: any) {
    this.dismissLoading();
    console.log("brightness:", brightness)
    const modal = await this.modalCtrl.create({
      component: ModalInfoPage,
      cssClass: "modal-info",
      componentProps: { 'brightness': brightness, 'id': id, 'belowThresholdAfterExceedancePerHour': belowThresholdAfterExceedancePerHour }
    });
    await modal.present();
  }

  getStalls(MAC: string): void {
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
            // Find the index of the item in the array using a custom method for comparing stall objects
            const index = this.stallsArray.findIndex((item) => item.equals(stall));
            if (index === -1) {
              this.stallsArray.push(stall);
            } else {
              // If the element is present, update the stall.isFree field
              this.stallsArray[index].isFree = stall.isFree;
            }
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
              parkingJson.availableStalls,
              parkingJson.brightnessThreshold
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
      cssClass: 'auto-height',
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
          this.updateThingShadow('{"state":{"desired": {"parkingLot_open": ' + !this.parking?.isOpen + '}}}');
          this.getParkingByMac(this.MAC);
        } else {
          console.log('No change or parking not found', response);
        }
      },
      error: (e) => console.error('Errore changing parking', e)
    });
  }

  deleteStall(id: number, pin: number) {
    this.mysqlService.deleteStall(this.MAC, id).subscribe({
      next: (response) => {
        if (response.affectedRows > 0) {
          console.log('stall deleted', response);
          this.presentToast("Stall deleted successfully");
          this.removeStallById(id);

          let stallsArrayTmp = this.stallsArray.filter((stall) => {
            return !stall.equals(new Stall(id, pin, this.MAC, false));
          });

          const stallIds: number[] = stallsArrayTmp.map((stall) => stall.id);
          const stallIdsString: string = stallIds.join(',');

          const stallGpio: number[] = stallsArrayTmp.map((stall) => stall.GPIO);
          const stallGpioString: string = stallGpio.join(',');

          console.log('{"state":{"desired":{"numStalls":' + this.stallsArray.length + ', "stalls_ids": [' + stallIdsString + '],"stalls_pinIds": [' + stallGpioString + ']}}}')
          this.updateThingShadow('{"state":{"desired":{"numStalls":' + this.stallsArray.length + ', "stalls_ids": [' + stallIdsString + '],"stalls_pinIds": [' + stallGpioString + ']}}}');
          this.getStalls(this.MAC);
          this.getParkingByMac(this.MAC);
        } else {
          console.log('No stall found', response);
        }
      },
      error: (e) => console.error('Errore deleting stall', e)
    });
  }

  getSensorValuesByIdAndMacAndTime(id: number, startTime: number, endTime: number): void {
    this.presentLoading();
    this.dynamoService.getSensorValuesByIdAndMacAndTime(id, this.MAC, startTime, endTime).subscribe({
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

          const belowThresholdAfterExceedancePerHour = SensorValue.countBrightnessBelowThresholdAfterExceedancePerHour(this.sensorValuesArray, this.parking?.brightnessThreshold ?? 1000);
          console.log(belowThresholdAfterExceedancePerHour);
          this.presentModalTodaysInfo(brightness, id, belowThresholdAfterExceedancePerHour.map((sensor) => sensor.belowThresholdCount));
        } else {
          console.log('No sensor values');
          this.presentToast("Not enough data");
          this.dismissLoading();
        }
      },
      error: (e) => {
        console.error('Error getting sensor values:', e), this.dismissLoading();
      }
    });
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'top',
      color: 'warning',
    });
    toast.present();
  }

  openModalChangeNumberOfStalls(): void {
    this.presentChangeNumberOfStalls();
  }

  async presentChangeNumberOfStalls() {
    const modal = await this.modalCtrl.create({
      component: ModalChangeNumberStallsPage,
      componentProps: { 'MAC': this.MAC },
      cssClass: 'auto-height'
    });

    modal.onDidDismiss().then((data) => {
      this.getParkingByMac(this.MAC);
    });

    await modal.present();
  }

  removeStallById(id: number): void {
    const index = this.stallsArray.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.stallsArray.splice(index, 1);
    }
  }

  updateThingShadow(body: string): void {
    this.aws.updateThingShadow(this.MAC, body).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (e) => console.error('Error updateThingShadow:', e)
    });
  }

  openModalChangeBrightnessThreshold(): void {
    this.presentChangeBrightnessThreshold();
  }

  async presentChangeBrightnessThreshold() {
    const modal = await this.modalCtrl.create({
      component: ModalChangeBrightnessThresholdPage,
      componentProps: { 'MAC': this.MAC },
      cssClass: 'auto-height'
    });

    modal.onDidDismiss().then((data) => {
      this.getParkingByMac(this.MAC);
    });

    await modal.present();
  }

  async presentLoading() {
    return await this.loadingController.create({
      spinner: "crescent",
      message: "Loading",
      translucent: true,
      backdropDismiss: false
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
      });
    });
  }

  async dismissLoading() {
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }

  async presentModalChooseDate(MAC: string, id: number) {
    const modal = await this.modalCtrl.create({
      component: ModalChooseDataPage,
      componentProps: { 'MAC': MAC, 'id': id, 'brightnessThreshold': this.parking?.brightnessThreshold ?? 1000 },
      cssClass: 'auto-height'
    });

    await modal.present();
  }

  deleteParking() {
    this.mysqlService.deleteParking(this.MAC).subscribe({
      next: (response) => {
        if (response.affectedRows > 0) {
          console.log('Parking deleted', response);
          this.router.navigate(['/parking']);
        } else {
          console.log('No change or parking not found', response);
        }
      },
      error: (e) => console.error('Errore deleting parking', e)
    });
  }
}
