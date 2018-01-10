import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-edituser',
  templateUrl: './edituser.component.html',
  styleUrls: ['./edituser.component.css']
})
export class EdituserComponent  {

  leads = [];
  userRoles = ["Normal","Leader","Administrator"];
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
    var user = { 
      username : this.employeeInfoForm.get('userEmail').value,
      userrole : this.employeeInfoForm.get('empType').value,
      leaderId : this.employeeInfoForm.get('leaderID').value
  };
  console.log(user);
    this.userService.registerUser(user)
    .subscribe(response => {
      this.employeeInfoForm.reset();
      swal("Great","User Added Successfully","info");
    },err=>{
      if(err.errors.username != undefined && err.errors.username=="is already taken."){
        swal("Oops","User Already Exist","error");
      }
      else {
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
