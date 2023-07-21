import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalChangeNumberStallsPageRoutingModule } from './modal-change-number-stalls-routing.module';

import { ModalChangeNumberStallsPage } from './modal-change-number-stalls.page';
import { HttpClientModule } from '@angular/common/http';
import { MysqlService } from '../services/mysql.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalChangeNumberStallsPageRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  declarations: [ModalChangeNumberStallsPage],
  providers: [
    MysqlService]
})
export class ModalChangeNumberStallsPageModule {}
