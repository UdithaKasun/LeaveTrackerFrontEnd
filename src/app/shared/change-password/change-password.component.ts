import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { browser } from 'protractor';
import { matchOtherValidator } from './match-other-validator';
import swal from 'sweetalert2';
import { UserService } from '../../services/user-service.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm = new FormGroup({
    userCurrentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required,Validators.minLength(8)]),
    confirmPassword : new FormControl('',[Validators.required,matchOtherValidator('newPassword')])
  });

  private validateAreEqual(fieldControl: FormControl) {
    return fieldControl.value === this.changePasswordForm.get('newPassword').value ? null : {
        NotEqual: true
    };
}

  constructor( private userService :UserService) { }

  ngOnInit() {
  }

  reset(){
    this.changePasswordForm.reset();
  }

  changePassword(){
    var changeRequest = {};
    changeRequest['username'] = window.localStorage['userid'];
    changeRequest['currentPassword'] = this.changePasswordForm.get('userCurrentPassword').value;
    changeRequest['newPassword'] = this.changePasswordForm.get('newPassword').value;

    if(changeRequest['currentPassword'] == changeRequest['newPassword']){
      swal("Error", "New Password should be Different", "warning");
      return;
    }
   
    this.userService.changePassword(changeRequest)
    .subscribe((data) => {
      window.localStorage['jwtToken'] = data.user.token;
      this.changePasswordForm.reset();
     swal("Success", "Password Changed Successfully", "success");
      
    }, (err) => {
      if(err.errors.currentPassword){
        swal("Error", err.errors.currentPassword, "error");
      }
      else {
        swal("Error", "Password Change Failed", "error");
      }
    });  
  }

 

}
