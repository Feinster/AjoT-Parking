import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { MysqlService } from '../services/mysql.service';
import { AwsIotService } from '../services/aws-iot.service';

@Component({
  selector: 'app-modal-change-brightness-threshold',
  templateUrl: './modal-change-brightness-threshold.page.html',
  styleUrls: ['./modal-change-brightness-threshold.page.scss'],
})
export class ModalChangeBrightnessThresholdPage implements OnInit {

  changeBrightnessThresholdForm: FormGroup;
  @Input() MAC: string = "";

  constructor(public formBuilder: FormBuilder, private modalCtrl: ModalController, private mysqlService: MysqlService, private aws: AwsIotService) {
    this.changeBrightnessThresholdForm = this.formBuilder.group({
      newBrightnessThreshold: [
        '',
        [
          Validators.required,
          Validators.pattern('^(0|[1-9]|[1-9]\\d{1,2}|[1-3]\\d{3}|40([0-8]\\d|9[0-5]))$')]
      ],
    });
  }

  ngOnInit() { }

  get errorControl() {
    return this.changeBrightnessThresholdForm.controls;
  }

  close() {
    this.modalCtrl.dismiss();
  }

  submitForm = () => {
    if (this.changeBrightnessThresholdForm.valid) {
      this.changeBrightnessThreshold(this.changeBrightnessThresholdForm.value.newBrightnessThreshold);
      return false;
    } else {
      this.validateAllFormFields(this.changeBrightnessThresholdForm);
      return false;
    }
  };

  changeBrightnessThreshold(newBrightnessThreshold: number): void {
    this.mysqlService.changeBrightnessThreshold(this.MAC, newBrightnessThreshold).subscribe({
      next: (response) => {
        if (response.affectedRows > 0) {
          console.log('Brightness Threshold changed', response);
          this.updateThingShadow(newBrightnessThreshold);
        } else {
          console.log('No change or parking not found', response);
        }
        this.close();
      },
      error: (e) => console.error('Errore changing brightness threshold', e)
    });
  }

  numericOnly(event: any): boolean {
    let pattern = /^([0-9])$/;
    let result = pattern.test(event.key);
    return result;
  }

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

  updateThingShadow(newBrightnessThreshold: number): void {
    this.aws.updateThingShadow(this.MAC, '{"state":{"desired":{"stall_free_brightness_threshold": ' + newBrightnessThreshold + '}}}').subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (e) => console.error('Error updateThingShadow:', e)
    });
  }
}
