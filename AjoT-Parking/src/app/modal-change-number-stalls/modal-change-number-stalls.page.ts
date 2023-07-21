import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { MysqlService } from '../services/mysql.service';

@Component({
  selector: 'app-modal-change-number-stalls',
  templateUrl: './modal-change-number-stalls.page.html',
  styleUrls: ['./modal-change-number-stalls.page.scss'],
})
export class ModalChangeNumberStallsPage implements OnInit {

  changeNumberOfStallsForm: FormGroup;
  @Input() MAC: string = "";

  constructor(public formBuilder: FormBuilder, private modalCtrl: ModalController, private mysqlService: MysqlService) {
    this.changeNumberOfStallsForm = this.formBuilder.group({
      newNStalls: ['', [Validators.required]],
    });
  }

  ngOnInit() { }

  get errorControl() {
    return this.changeNumberOfStallsForm.controls;
  }

  close() {
    this.modalCtrl.dismiss();
  }

  submitForm = () => {
    if (this.changeNumberOfStallsForm.valid) {
      this.changeNumberOfStalls(this.changeNumberOfStallsForm.value.newNStalls);
      return false;
    } else {
      return false;
    }
  };

  changeNumberOfStalls(newNStalls: number): void {
    this.mysqlService.changeNumberOfStalls(this.MAC, newNStalls).subscribe({
      next: (response) => {
        if (response.affectedRows > 0) {
          console.log('Number of stalls changed', response);
        } else {
          console.log('No change or parking not found', response);
        }
        this.close();
      },
      error: (e) => console.error('Errore changing number of stalls', e)
    });
  }

  numericOnly(event: any): boolean {
    let pattern = /^([0-9])$/;
    let result = pattern.test(event.key);
    return result;
  }
}
