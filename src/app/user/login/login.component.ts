import { Component, OnInit } from '@angular/core';
import IUser from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials = {
    email: '',
    password: ''
  }
  alertColor:string = 'blue';
  showAlert: boolean = false;
  alertMsg = 'Please wait! We are logging you in.'
  inSubmission = false;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

  async login(){
    this.showAlert = true;
    this.inSubmission = true;
    try{
      await this.auth.loginUser({ email: this.credentials.email, password: this.credentials.password } as IUser);
      this.alertMsg = "Success! You're now logged in.";
      this.alertColor = 'green';
      this.inSubmission = false;
    }
    catch(e){
      this.inSubmission = false;
      this.alertMsg = "An unexpected error occurred. Please try again later."
      this.alertColor = "red";
      return;
    }
  }
}
