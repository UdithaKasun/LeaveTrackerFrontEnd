import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from './api-service.service';

@Injectable()
export class LeaveServiceService {

  userId = "";
  leadId = "";

  constructor(private apiService : ApiService) { 
    this.userId = window.localStorage['userid'];
    this.leadId = window.localStorage['leadid'];
  }

  getLeavesByUserId() : Observable<any> {
    return this.apiService.get('/leaves/user/' + this.userId)
    .map(data => {
      return data;
    });
  }

  saveLeaves(newLeaves,exLeaves,delLeaves) : Observable<any> {
    return this.apiService.post('/leaves', { newLeaves : newLeaves ,  removeLeaves : delLeaves , existLeaves : exLeaves})
    .map(data => {
      return data;
    });
  }

  updateLeaves(leaves) : Observable<any> {
    return this.apiService.put('/leaves', { leaves : leaves , status : "Update"})
    .map(data => {
      return data;
    });
  }

  deleteLeaves(leaves) : Observable<any> {
    return this.apiService.put('/leaves', { leaves : leaves , status : "Delete"})
    .map(data => {
      return data;
    });
  }

  // deleteLeaves(leaves) : Observable<any> {
  //   return this.apiService.post('/test/removeLeaves', { leaves : leaves })
  //   .map(data => {
  //     return data;
  //   });
  // }
}
