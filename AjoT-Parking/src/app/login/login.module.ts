import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { HttpClientModule } from '@angular/common/http';
import { MysqlService } from '../services/mysql.service';
import { DynamoDbClientService } from '../services/dynamo-db-client.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  declarations: [LoginPage],
  providers: [
    MysqlService, DynamoDbClientService]
})
export class LoginPageModule {}
