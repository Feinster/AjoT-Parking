import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParkingPageRoutingModule } from './parking-routing.module';

import { ParkingPage } from './parking.page';
import { MysqlService } from '../services/mysql.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParkingPageRoutingModule,
    HttpClientModule,
  ],
  declarations: [ParkingPage],
  providers: [
    MysqlService]
})
export class ParkingPageModule {}
