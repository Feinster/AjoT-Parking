import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  ionicForm: FormGroup;

  constructor(public formBuilder: FormBuilder) {
    this.ionicForm = this.formBuilder.group({
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
    return this.ionicForm.controls;
  }

  submitForm = () => {
    if (this.ionicForm.valid) {
      console.log(this.ionicForm.value);
      return false;
    } else {
      return console.log('Please provide all the required values!');
    }
  };
}
