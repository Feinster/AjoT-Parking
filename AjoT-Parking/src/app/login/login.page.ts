import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MysqlService } from '../services/mysql.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;

  constructor(private router: Router, private mysqlService: MysqlService, public formBuilder: FormBuilder, private userService: UserService, private toastController: ToastController) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required,],],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() { }

  get errorControl() {
    return this.loginForm.controls;
  }

  back(): void {
    this.router.navigate(['/home']);
  }

  checkUserCredentials(email: string, password: string) {
    this.mysqlService.getUsersByEmailAndPassword(email, password).subscribe({
      next: (response) => {
        if (response.length > 0) {
          this.userService.login(email, response[0].isAdmin === 1 ? true : false);
          this.router.navigate(['/parking']);
        } else {
          this.presentToast("Invalid user credentials");
        }
      },
      error: (e) => {
        console.error("Error verifying user credentials", e);
        this.presentToast("Error verifying user credentials");
      }
    });
  }

  signIn = () => {
    if (this.loginForm.valid) {
      this.checkUserCredentials(this.loginForm.value.email, this.loginForm.value.password);
    } else {
      this.validateAllFormFields(this.loginForm);
    }
  };

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      console.log(field);
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'top',
      color: 'warning',
    });
    toast.present();
  }
}



