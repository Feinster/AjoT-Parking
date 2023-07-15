import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MysqlService } from '../services/mysql.service';
import { ModalController, ToastController } from '@ionic/angular';
import { Stall } from '../models/Stall';

@Component({
  selector: 'app-modal-add-stall',
  templateUrl: './modal-add-stall.page.html',
  styleUrls: ['./modal-add-stall.page.scss'],
})
export class ModalAddStallPage implements OnInit {

  addStallForm: FormGroup;
  @Input() MAC: string = "";

  constructor(public formBuilder: FormBuilder, private modalCtrl: ModalController, private mysqlService: MysqlService, private toastController: ToastController) {
    this.addStallForm = this.formBuilder.group({
      GPIO: ['', [Validators.required]],
      id: ['', [Validators.required]],
    });
  }

  ngOnInit() { }

  get errorControl() {
    return this.addStallForm.controls;
  }

  close() {
    this.modalCtrl.dismiss();
  }

  submitForm = () => {
    if (this.addStallForm.valid) {
      var stall : Stall = new Stall(this.addStallForm.value.id, this.addStallForm.value.GPIO, this.MAC, true);
      console.log(stall);
      this.stallInsertion(stall);
      return false;
    } else {
      this.validateAllFormFields(this.addStallForm);
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

  stallInsertion(stall: Stall) {
    this.mysqlService.stallInsertion(stall.id, stall.GPIO, stall.MAC_parking, true).subscribe({
      next: (response) => {
        if (response.affectedRows > 0) {
          this.presentToast("Stall inserted successfully");
          console.log('Stall inserted successfully');
        } else {
          this.presentToast("Stall not inserted");
          console.log('Stall not inserted');
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
      //cssClass: "toast-custom-class",
    });
    toast.present();
  }

}
