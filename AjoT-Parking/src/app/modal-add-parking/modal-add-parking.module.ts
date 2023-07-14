import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalAddParkingPageRoutingModule } from './modal-add-parking-routing.module';

import { ModalAddParkingPage } from './modal-add-parking.page';
import { HttpClientModule } from '@angular/common/http';
import { MysqlService } from '../services/mysql.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalAddParkingPageRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  declarations: [ModalAddParkingPage],
  providers: [
    MysqlService]
})
export class ModalAddParkingPageModule {}
