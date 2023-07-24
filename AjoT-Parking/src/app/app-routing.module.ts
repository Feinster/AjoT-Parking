import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'parking',
    loadChildren: () => import('./parking/parking.module').then( m => m.ParkingPageModule)
  },
  {
    path: 'registration',
    loadChildren: () => import('./registration/registration.module').then( m => m.RegistrationPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'stalls-management',
    loadChildren: () => import('./stalls-management/stalls-management.module').then( m => m.StallsManagementPageModule)
  },
  {
    path: 'modal-info',
    loadChildren: () => import('./modal-info/modal-info.module').then( m => m.ModalInfoPageModule)
  },
  {
    path: 'modal-add-parking',
    loadChildren: () => import('./modal-add-parking/modal-add-parking.module').then( m => m.ModalAddParkingPageModule)
  },
  {
    path: 'modal-add-stall',
    loadChildren: () => import('./modal-add-stall/modal-add-stall.module').then( m => m.ModalAddStallPageModule)
  },
  {
    path: 'modal-change-number-stalls',
    loadChildren: () => import('./modal-change-number-stalls/modal-change-number-stalls.module').then( m => m.ModalChangeNumberStallsPageModule)
  },
  {
    path: 'modal-change-brightness-threshold',
    loadChildren: () => import('./modal-change-brightness-threshold/modal-change-brightness-threshold.module').then( m => m.ModalChangeBrightnessThresholdPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
