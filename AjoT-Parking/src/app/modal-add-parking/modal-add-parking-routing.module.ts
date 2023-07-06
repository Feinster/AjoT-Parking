import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalAddParkingPage } from './modal-add-parking.page';

const routes: Routes = [
  {
    path: '',
    component: ModalAddParkingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalAddParkingPageRoutingModule {}
