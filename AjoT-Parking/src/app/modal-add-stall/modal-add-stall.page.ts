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
      var stall: Stall = new Stall(this.addStallForm.value.id, this.addStallForm.value.GPIO, this.MAC, true);
      console.log(stall);
      this.stallInsertion(stall);
      return false;
    } else {
      this.validateAllFormFields(this.addStallForm);
      return this.presentToast('Please provide all the required values!')
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

  async stallInsertion(stall: Stall) {
    let isStallInsertable = await this.isStallInsertable(stall.MAC_parking);
    console.log("QUI")

    if (isStallInsertable) {
      this.mysqlService.stallInsertion(stall.id, stall.GPIO, stall.MAC_parking, true).subscribe({
        next: (response) => {
          if (response.affectedRows > 0) {
            this.presentToast("Stall inserted successfully");
          } else {
            this.presentToast("Stall not inserted");
          }
        },
        error: (e) => {
          console.error('Error inserting parking', e);
          this.presentToast('Error inserting parking');
        }
      });
    }
    else{
      this.presentToast("Mximum number of stalls reached");
    }

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

  async isStallInsertable(MAC: string): Promise<boolean> {
    try {
      const response = await this.mysqlService.countNStalls(MAC).toPromise();

      if (response.length > 0) {
        let maxStalls = response[0].maxStalls;
        let stalls = response[0].stalls;
        console.log(maxStalls, stalls);
        if (stalls + 1 > maxStalls) {
          return false;
        } else {
          return true
        }
      } else {
        console.log('No stalls found');
        return false;
      }
    } catch (e) {
      console.error('Errore searching stalls', e);
      return false;
    }
  }
}
