import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalAddStallPage } from './modal-add-stall.page';

const routes: Routes = [
  {
    path: '',
    component: ModalAddStallPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalAddStallPageRoutingModule {}
