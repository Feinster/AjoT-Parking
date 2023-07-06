import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StallsManagementPage } from './stalls-management.page';

const routes: Routes = [
  {
    path: '',
    component: StallsManagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StallsManagementPageRoutingModule {}
