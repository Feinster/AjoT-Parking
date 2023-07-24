import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalChangeBrightnessThresholdPage } from './modal-change-brightness-threshold.page';

const routes: Routes = [
  {
    path: '',
    component: ModalChangeBrightnessThresholdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalChangeBrightnessThresholdPageRoutingModule {}
