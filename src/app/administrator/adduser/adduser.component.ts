import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent {
  showLoad:boolean = false;
  leads = [];
  userRoles = ["Member","Leader","Administrator"];
  constructor(private userService : UserService){
    this.userService.loadLeads()
    .subscribe(leads => {
      this.leads = leads;
    })
  }

  employeeInfoForm = new FormGroup({
    userEmail: new FormControl('', [Validators.email,Validators.required]),
    empType: new FormControl('Normal', []),
    leaderID : new FormControl('', [])
  });

  submitted = false;
  onSubmit() {
    this.showLoad=true;
    var user = { 
      username : this.employeeInfoForm.get('userEmail').value,
      userrole : this.employeeInfoForm.get('empType').value,
      leaderId : this.employeeInfoForm.get('leaderID').value
  };
  console.log(user);
    this.userService.registerUser(user)
    .subscribe(response => {
      this.employeeInfoForm.reset();
      this.showLoad=false;
      swal("Great","User Added Successfully","info");
    },err=>{
      if(err.errors.username != undefined && err.errors.username=="is already taken."){
        this.showLoad=false;
        swal("Oops","User Already Exist","error");
      }
      else {        
        this.showLoad=false;
        swal("Oops","User Registration Failed","error");
      }
    })    
  }

  addNewEmployeeAddress() {
    this.employeeInfoForm.reset();
    this.submitted = false;
  }

  resetForm(){
    this.employeeInfoForm.get('userEmail').setValue("");
  }

}
