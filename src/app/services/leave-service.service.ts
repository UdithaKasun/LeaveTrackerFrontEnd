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
}
