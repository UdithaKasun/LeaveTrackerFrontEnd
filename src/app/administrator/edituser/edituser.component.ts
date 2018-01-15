import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service.service';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import swal from 'sweetalert2';
import { Observable } from 'rxjs/Observable';
import { LeaderServiceService } from '../../services/leader-service.service';

@Component({
  selector: 'app-edituser',
  templateUrl: './edituser.component.html',
  styleUrls: ['./edituser.component.css']
})
export class EdituserComponent  {

  leads = [];
  employees = [];
  employeeCtrl: FormControl;
  filteredEmpObs: Observable<any[]>;
  
  userRoles = ["Normal","Leader","Administrator"];
  constructor(private userService : UserService, private leaderService:LeaderServiceService){
    this.employeeCtrl = new FormControl();
    this.userService.loadLeads()
    .subscribe(leads => {
      this.leads = leads;
    })

    leaderService.getleaderMembers().subscribe(Response => {
      for (var i = 0; i < Response.length; i++) {
        this.employees.push({ employeeID: Response[i].username })
      }
      this.filteredEmpObs = this.employeeCtrl.valueChanges
        .pipe(
        startWith(''),
        map(state => state ? this.filteredEmp(state) : this.employees.slice())
        );
    })
  }

  filteredEmp(employeeID: string) {
    console.log("Here : " + employeeID);
    return this.employees.filter(state =>
      state.employeeID.toLowerCase().indexOf(employeeID.toLowerCase()) === 0);
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
