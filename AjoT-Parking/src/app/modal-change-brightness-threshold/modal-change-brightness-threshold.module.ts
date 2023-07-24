import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalChangeBrightnessThresholdPageRoutingModule } from './modal-change-brightness-threshold-routing.module';

import { ModalChangeBrightnessThresholdPage } from './modal-change-brightness-threshold.page';
import { HttpClientModule } from '@angular/common/http';
import { MysqlService } from '../services/mysql.service';
import { AwsIotService } from '../services/aws-iot.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalChangeBrightnessThresholdPageRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  declarations: [ModalChangeBrightnessThresholdPage],
  providers: [
    MysqlService, AwsIotService]
})
export class ModalChangeBrightnessThresholdPageModule {}
