import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
username:any;
password:any;
  constructor(public router:Router ) { }

  ngOnInit() {
  }
  login(){
    if(this.password&&this.username==123){
      this.router.navigateByUrl('/member');
    }else if(this.password&&this.username==12){
      this.router.navigateByUrl('/leader');
    }
   
  }
}
