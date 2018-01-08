import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from '../services/user-service.service';
import { User } from '../services/models/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
username:any;
password:any;
  constructor(public router:Router , private loginService : UserService) { }

  ngOnInit() {
  }
  login(){

    let user : User = new User();
    user.username = this.username;
    user.password = this.password;

    this.loginService.attemptLogin(user)
    .subscribe((data) => {
      this.router.navigateByUrl('/member');
    }, (err) => {
      alert("Invalid Credentials...");
    });   
  }
}
