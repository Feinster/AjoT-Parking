import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { MysqlService } from '../services/mysql.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Parking } from '../models/Parking';

@Component({
  selector: 'app-modal-add-parking',
  templateUrl: './modal-add-parking.page.html',
  styleUrls: ['./modal-add-parking.page.scss'],
})
export class ModalAddParkingPage implements OnInit {

  addParkingForm: FormGroup;

  constructor(public formBuilder: FormBuilder, private modalCtrl: ModalController, private mysqlService: MysqlService, private toastController: ToastController) {
    this.addParkingForm = this.formBuilder.group({
      MAC: ['', [Validators.required]],
      city: ['', [Validators.required]],
      address: ['', [Validators.required]],
      location: ['', [Validators.required]],
      imageName: ['', [Validators.required]],
      isOpen: ['', [Validators.required]],
    });
  }

  ngOnInit() { }

  get errorControl() {
    return this.addParkingForm.controls;
  }

  close() {
    this.modalCtrl.dismiss();
  }

  numericOnly(event: any): boolean {
    let pattern = /^([0-9])$/;
    let result = pattern.test(event.key);
    return result;
  }

  submitForm = () => {
    if (this.addParkingForm.valid) {
      var parking: Parking = new Parking(this.addParkingForm.value.MAC, this.addParkingForm.value.city, this.addParkingForm.value.address,
        this.addParkingForm.value.location, 0, this.addParkingForm.value.isOpen, this.addParkingForm.value.imageName, 0);
      this.parkingInsertion(parking);
      return false;
    } else {
      this.validateAllFormFields(this.addParkingForm);
      return console.log('Please provide all the required values!');
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

  parkingInsertion(parking: Parking) {
    this.mysqlService.parkingInsertion(parking.MAC, parking.city, parking.address, parking.location, parking.nStalls, parking.isOpen, parking.img).subscribe({
      next: (response) => {
        if (response.affectedRows > 0) {
          this.presentToast("Parking inserted successfully");
          console.log('Parking inserted successfully');
        } else {
          this.presentToast("Parking not inserted");
          console.log('Parking not inserted');
        }
      },
      error: (e) => console.error('Error inserting parking', e)
    });

    this.close();
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
}
