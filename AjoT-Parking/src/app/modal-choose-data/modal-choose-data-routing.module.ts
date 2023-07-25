import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalChooseDataPage } from './modal-choose-data.page';

const routes: Routes = [
  {
    path: '',
    component: ModalChooseDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalChooseDataPageRoutingModule {}
