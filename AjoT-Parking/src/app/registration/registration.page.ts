import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MysqlService } from '../services/mysql.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  registrationForm: FormGroup;

  constructor(public formBuilder: FormBuilder, private router: Router, private mysqlService: MysqlService, private userService: UserService) {
    this.registrationForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit() { }

  get errorControl() {
    return this.registrationForm.controls;
  }

  submitForm = () => {
    if (this.registrationForm.valid) {
      this.registration(this.registrationForm.value.firstName, this.registrationForm.value.lastName, this.registrationForm.value.email, this.registrationForm.value.password);
      return false;
    } else {
      this.validateAllFormFields(this.registrationForm);
      return console.log('Please provide all the required values!');
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

  registration(firstName: string, lastName: string, email: string, password: string) {
    this.mysqlService.userRegistration(firstName, lastName, email, password).subscribe({
      next: (response) => {
        if (response.affectedRows > 0) {
          console.log('User registered successfully');
          this.userService.login(email, false);
          this.router.navigate(['/parking']);
        } else {
          console.log('Unregistered user');
        }
      },
      error: (e) => console.error('Error verifying user credentials:', e)
    });
  }

}
