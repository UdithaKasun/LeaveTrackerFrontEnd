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
  selectedUserRole = "Member";
  selectedLead = "None";
  selectedUser = "";
  userFound = false;

  userRoles = ["Member","Leader"];
  constructor(private userService : UserService, private leaderService:LeaderServiceService){
    this.employeeCtrl = new FormControl();
    this.userService.loadLeads()
    .subscribe(leads => {
      this.leads = leads;
      this.leads.unshift("None");
    })

    userService.getUsers().subscribe(Response => {
      for (var i = 0; i < Response.length; i++) {
        this.employees.push({ username: Response[i].username , userrole: Response[i].userrole , leaderid: Response[i].leaderid  })
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
      state.username.toLowerCase().indexOf(employeeID.toLowerCase()) === 0);
  }

  selectMember(selectedEmp){
    console.log(selectedEmp);
    this.userFound = true;
    this.selectedLead = selectedEmp.leaderid;
    this.selectedUserRole = selectedEmp.userrole;
    this.selectedUser = selectedEmp.username;
  }

  employeeInfoForm = new FormGroup({
    empType: new FormControl('Member', []),
    leaderID : new FormControl('', [])
  });

  submitted = false;
  onSubmit() {
    var user = { 
      username : this.employeeInfoForm.get('userEmail').value,
      userrole : this.employeeInfoForm.get('empType').value,
      leaderid : this.employeeInfoForm.get('leaderID').value
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

  updateUser(){
    var userDetails = {};
    userDetails['username'] = this.selectedUser;
    userDetails['userrole'] = this.selectedUserRole;
    userDetails['leaderid'] = this.selectedLead;
    console.log(userDetails);

    this.userService.updateUser(userDetails)
    .subscribe(response => {
      swal("Success","User Updated Successfully","info");
    },err=>{
      if(err.errors.username != undefined && err.errors.username=="is already taken."){
        swal("Error","User Already Exist","error");
      }
      else {
        swal("Error","User Update Failed","error");
      }
    }) 
  }

}
