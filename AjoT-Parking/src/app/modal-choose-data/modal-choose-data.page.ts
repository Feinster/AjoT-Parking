import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { SensorValue } from '../models/SensorValue';
import { DynamoDbClientService } from '../services/dynamo-db-client.service';
import { ModalInfoPage } from '../modal-info/modal-info.page';

@Component({
  selector: 'app-modal-choose-data',
  templateUrl: './modal-choose-data.page.html',
  styleUrls: ['./modal-choose-data.page.scss'],
})
export class ModalChooseDataPage implements OnInit {

  chooseDateForm: FormGroup;

  sensorValuesArray: SensorValue[] = [];

  @Input() MAC: string = "";
  @Input() id: number = 0;
  @Input() brightnessThreshold: number = 0;

  constructor(public formBuilder: FormBuilder, private modalCtrl: ModalController, private toastController: ToastController,
    private loadingController: LoadingController, private dynamoService: DynamoDbClientService) {
    this.chooseDateForm = this.formBuilder.group({
      date: ['', [Validators.required]],
    });
  }

  ngOnInit() { }

  get errorControl() {
    return this.chooseDateForm.controls;
  }

  close() {
    this.modalCtrl.dismiss();
  }

  submitForm = () => {
    if (this.chooseDateForm.valid) {
      console.log(this.chooseDateForm.value.date);
      this.openModalInfo(this.id, this.chooseDateForm.value.date);
      return false;
    } else {
      this.validateAllFormFields(this.chooseDateForm);
      return false;
    }
  };

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      console.log(field);
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  openModalInfo(id: number, dateString: string): void {
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    const startTime = date.getTime() * 1000;

    date.setHours(23, 59, 59, 999);
    const endTime = date.getTime() * 1000;
    this.getSensorValuesByIdAndMacAndTime(id, startTime, endTime);
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

          const belowThresholdAfterExceedancePerHour = SensorValue.countBrightnessBelowThresholdAfterExceedancePerHour(this.sensorValuesArray, this.brightnessThreshold);
          console.log(belowThresholdAfterExceedancePerHour);

          this.presentModalInfo(brightness, id, belowThresholdAfterExceedancePerHour.map((sensor) => sensor.belowThresholdCount));
          this.sensorValuesArray = [];
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


  async presentModalInfo(brightness: any, id: number, belowThresholdAfterExceedancePerHour: any) {
    this.dismissLoading();
    console.log("brightness:", brightness)
    const modal = await this.modalCtrl.create({
      component: ModalInfoPage,
      cssClass: "modal-info",
      componentProps: { 'brightness': brightness, 'id': id, 'belowThresholdAfterExceedancePerHour': belowThresholdAfterExceedancePerHour }
    });
    await modal.present();
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

}
