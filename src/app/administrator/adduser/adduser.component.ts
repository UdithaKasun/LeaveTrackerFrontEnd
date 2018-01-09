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

  constructor(private userService : UserService){

  }

  employeeInfoForm = new FormGroup({
    userEmail: new FormControl('', [Validators.email,Validators.required]),
    empType: new FormControl('Normal', [])
  });

  submitted = false;
  onSubmit() {
    var user = { 
      username : this.employeeInfoForm.get('userEmail').value,
      userrole : this.employeeInfoForm.get('empType').value
  };

    this.userService.registerUser(user)
    .subscribe(response => {
      this.employeeInfoForm.reset();
      swal("Great","User Added Successfully","info");
    });

    
  }

  addNewEmployeeAddress() {
    this.employeeInfoForm.reset();
    this.submitted = false;
  }

}
