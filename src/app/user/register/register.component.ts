import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import IUser from 'src/app/models/user.model';

import { AuthService } from 'src/app/services/auth.service';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  constructor( 
    private authService: AuthService,
    private emailTaken: EmailTaken
  ){  }

  inSubmission: boolean = false;

  name = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ]);

  email = new FormControl('',[
    Validators.required,
    Validators.email
  ], [this.emailTaken.validate]);

  age = new FormControl('', [
    Validators. required, 
    Validators.min(18), 
    Validators.max(120)
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)]);
  confirmPassword = new FormControl('', [Validators.required]);
  phoneNumber = new FormControl('', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]);

  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirmPassword: this.confirmPassword,
    phoneNumber: this.phoneNumber
  }, [RegisterValidators.match('password', 'confirmPassword')]);
  alertColor:string = 'blue';
  showAlert: boolean = false;
  alertMsg = ''

  ngOnInit(): void {

  }

  async register(){
    if(this.registerForm.invalid || this.inSubmission){
      return;
    }

    this.showAlert = true;
    this.alertMsg = 'Please wait! Your account is being created.';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try{
      const userData: IUser = this.registerForm.value;
      this.authService.createUser(userData);
    }
    catch(e){
      console.log(e);
      this.alertMsg = "An unexpected error occurred. Please try again later."
      this.alertColor = "red";
      this.inSubmission = false;
      return;
    }

    this.alertMsg = "Success! Your accout has been created";
    this.alertColor = "green";
  }

}
