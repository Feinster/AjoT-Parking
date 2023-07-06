import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StallsManagementPageRoutingModule } from './stalls-management-routing.module';

import { StallsManagementPage } from './stalls-management.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StallsManagementPageRoutingModule
  ],
  declarations: [StallsManagementPage]
})
export class StallsManagementPageModule {}
