import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from './api-service.service';
import { URLSearchParams } from '@angular/http';
import { Subject } from 'rxjs';

@Injectable()
export class LeaderServiceService {
    userId = "";
    leadId = "";
  
    constructor(private apiService : ApiService) { 
      this.userId = window.localStorage['userid'];
      this.leadId = window.localStorage['leadid'];
    }

    public pendingLeaveCountSource = new Subject<number>();

    leaveCountChanged$ = this.pendingLeaveCountSource.asObservable();
    
    getleaderMembers() : Observable<any> {
        return this.apiService.get('/user/' + this.userId)
        .map(data => {
          return data;
        });
    }

    getPendingLeavesForLeader() : Observable<any> {
      let parameters = new URLSearchParams();
      parameters.append("status","PENDING");
      return this.apiService.get('/leaves/leader/' + this.userId,parameters)
        .map(data => {
          return data;
        });
    }

    getPendingLeavesCount() : Observable<String> {
      let parameters = new URLSearchParams();
      parameters.append("status","PENDING");
      return this.apiService.get('/leaves/leader/' + this.userId,parameters)
        .map(data => {
          return data.leaves.length;
        });
    }

    updateLeaveStatus(leaveid,status,currentLeaveCount) : Observable<any> {
      var updateLeave = {};
      updateLeave['leave_id'] = leaveid;
      updateLeave['leave_status'] = status;
      return this.apiService.put('/leaves/status/',{ leave : updateLeave})
        .map(data => {
          currentLeaveCount = currentLeaveCount - 1;
          this.pendingLeaveCountSource.next(currentLeaveCount);
          return data;
        });
    }
}