import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalAddParkingPageRoutingModule } from './modal-add-parking-routing.module';

import { ModalAddParkingPage } from './modal-add-parking.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalAddParkingPageRoutingModule
  ],
  declarations: [ModalAddParkingPage]
})
export class ModalAddParkingPageModule {}
