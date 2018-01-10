import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from '../services/user-service.service';
import { User } from '../services/models/User';
import swal from 'sweetalert2';

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
      console.log(data);
      window.localStorage['userid'] = data.user.username;
      window.localStorage['leadid'] = data.leaderid;
      if(data.role == "Leader"){
        this.router.navigateByUrl('/leader');
      }else if(data.role == "Member"){
      this.router.navigateByUrl('/member');
      }else if(data.role == "Admin"){
        this.router.navigateByUrl('/admin');
      }
    }, (err) => {
      swal("Oops", "Invalid Credentials...", "warning");
    });   
  }
}
