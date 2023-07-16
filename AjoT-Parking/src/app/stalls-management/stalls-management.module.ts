import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StallsManagementPageRoutingModule } from './stalls-management-routing.module';

import { StallsManagementPage } from './stalls-management.page';
import { HttpClientModule } from '@angular/common/http';
import { MysqlService } from '../services/mysql.service';
import { DynamoDbClientService } from '../services/dynamo-db-client.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StallsManagementPageRoutingModule,
    HttpClientModule,
  ],
  declarations: [StallsManagementPage],
  providers: [
    MysqlService, DynamoDbClientService]
})
export class StallsManagementPageModule {}
