import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalChangeNumberStallsPage } from './modal-change-number-stalls.page';

const routes: Routes = [
  {
    path: '',
    component: ModalChangeNumberStallsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalChangeNumberStallsPageRoutingModule {}
