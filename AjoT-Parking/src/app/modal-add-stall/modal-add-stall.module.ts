import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalAddStallPageRoutingModule } from './modal-add-stall-routing.module';

import { ModalAddStallPage } from './modal-add-stall.page';
import { HttpClientModule } from '@angular/common/http';
import { MysqlService } from '../services/mysql.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalAddStallPageRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  declarations: [ModalAddStallPage],
  providers: [
    MysqlService]
})
export class ModalAddStallPageModule {}
