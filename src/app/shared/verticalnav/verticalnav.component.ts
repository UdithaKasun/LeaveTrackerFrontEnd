import { Component, OnInit } from '@angular/core';
import { LeaveServiceService } from '../../services/leave-service.service';

@Component({
  selector: 'app-verticalnav',
  templateUrl: './verticalnav.component.html',
  styleUrls: ['./verticalnav.component.css']
})
export class VerticalnavComponent implements OnInit {

  notifications = [];
  constructor(private leaveService : LeaveServiceService) { }

  ngOnInit() {
    this.leaveService.getNewNotifications()
    .subscribe(data => {
      this.notifications = data.notifications;
    })
  }

  onClose(notificationId){
    console.log("Helllo")
    this.leaveService.markNotificationAsRead(notificationId)
    .subscribe(data=>{

    });
  }

}
