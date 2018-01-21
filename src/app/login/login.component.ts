import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from '../services/user-service.service';
import { User } from '../services/models/User';
import swal from 'sweetalert2';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
username:any;
password:any;

@BlockUI() blockUI: NgBlockUI;
  constructor(public router:Router , private loginService : UserService) { }

  ngOnInit() {
  }
  login(){

    let user : User = new User();
    user.username = this.username;
    user.password = this.password;

    this.blockUI.start();
    this.loginService.attemptLogin(user)
    .subscribe((data) => {
      console.log(data);
      this.blockUI.stop();
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
      this.blockUI.stop();
      swal("Error", "Invalid Credentials...", "warning");
    });   
  }

  resetAccount(){
    swal({
      title: 'Enter your Account Address',
      input: 'email',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !swal.isLoading()
    }).then((result) => {
      console.log(result);
      var request = { 
        username : ""
      };
      request.username = result.value;
      this.blockUI.start();
      this.loginService.resetAccount(request)
      .subscribe((data) => {
        this.blockUI.stop();
        swal({
          type: 'success',
          title: 'Success',
          html: 'Account Reset Success'
        })
      }, (err) => {
        this.blockUI.stop();
        if(err.errors.username){
          swal("Error", err.errors.username, "error");
        }
        else {
          swal("Error", "Account Reset Failed", "warning");
        }
      });
    })
  }
}
