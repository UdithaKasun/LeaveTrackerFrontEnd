import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from './api-service.service';
import { URLSearchParams } from '@angular/http';

@Injectable()
export class LeaveServiceService {

  userId = "";
  leadId = "";

  constructor(private apiService : ApiService) { 
    this.userId = window.localStorage['userid'];
    this.leadId = window.localStorage['leadid'];
  }

  getNewNotifications(){
    let parameters = new URLSearchParams();
      parameters.append("status","NEW");
      return this.apiService.get('/notifications/user/' + this.userId,parameters)
        .map(data => {
          return data;
        });
  }

  markNotificationAsRead(noti_id){
    var notification = {
      notification_id : noti_id,
      status : "READ"
    };
    return this.apiService.put('/notifications/status', { notification : notification})
    .map(data => {
      return data;
    });
  }

  getLeavesByUserId() : Observable<any> {
    return this.apiService.get('/leaves/user/' + this.userId)
    .map(data => {
      return data;
    });
  }

  getLeavesForUser(userId) : Observable<any> {
    return this.apiService.get('/leaves/user/' + userId)
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
