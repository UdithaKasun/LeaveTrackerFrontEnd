import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import swal from 'sweetalert2';
import { LeaderServiceService } from '../../services/leader-service.service';
import { NgBlockUI, BlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-pending-approval',
  templateUrl: './pending-approval.component.html',
  styleUrls: ['./pending-approval.component.css']
})
export class PendingApprovalComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  
  constructor( private leaderService : LeaderServiceService) { }

  leaves=[];

  ngOnInit() {
    this.loadLeaves();
  }

  loadLeaves(){
    this.leaderService.getPendingLeavesForLeader()
    .subscribe(data =>{
      this.leaves = [];
      data.leaves.forEach(leave => {
        var newLeave = {};
        var fromDate = new Date(leave.leave_from_date).setDate(new Date(leave.leave_from_date).getDate() + 1);
        newLeave['leaveid'] = leave.leave_id;
        newLeave['name'] = leave.user_id;
        newLeave['from'] = new Date(fromDate).toISOString().slice(0, 10);
        newLeave['to'] = new Date(leave.leave_to_date).toISOString().slice(0, 10);
        newLeave['count'] = leave.leave_count;
        this.leaves.push(newLeave);
      });
      this.leaderService.pendingLeaveCountSource.next(this.leaves.length);
    }
  )
  }

  approve(leave_id){
    this.blockUI.start();
    this.leaderService.updateLeaveStatus(leave_id,"APPROVED",this.leaves.length)
    .subscribe(data=>{
      this.blockUI.stop();
      swal("Success","Leave Approved Successfully","success");
      var leave = this.leaves.filter(item => {
        return item.leaveid  == leave_id;
      })

      var index = this.leaves.indexOf(leave);
      this.leaves.splice(index, 1);
    })
  }

  reject(leave_id){
    this.blockUI.start();
    this.leaderService.updateLeaveStatus(leave_id,"REJECTED",this.leaves.length)
    .subscribe(data=>{
      this.blockUI.stop();
      swal("Success","Leave Rejected Successfully","success");
      var leave = this.leaves.filter(item => {
        return item.leaveid  == leave_id;
      })

      var index = this.leaves.indexOf(leave);
      this.leaves.splice(index, 1);
    })
  }

  


}
