import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalChooseDataPageRoutingModule } from './modal-choose-data-routing.module';

import { ModalChooseDataPage } from './modal-choose-data.page';
import { DynamoDbClientService } from '../services/dynamo-db-client.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalChooseDataPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ModalChooseDataPage],
  providers: [
    DynamoDbClientService]
})
export class ModalChooseDataPageModule { }
