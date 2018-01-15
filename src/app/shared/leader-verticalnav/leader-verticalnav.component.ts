import { Component, OnInit } from '@angular/core';
import { LeaderServiceService } from '../../services/leader-service.service';

@Component({
  selector: 'app-leader-verticalnav',
  templateUrl: './leader-verticalnav.component.html',
  styleUrls: ['./leader-verticalnav.component.css']
})
export class LeaderVerticalnavComponent implements OnInit {

  pendingCount = 0;

  constructor(private leadService : LeaderServiceService) { 
    this.leadService.leaveCountChanged$.subscribe(
      leaveCount => {
        this.pendingCount = leaveCount;
      });
  }

  ngOnInit() {
    this.leadService.getPendingLeavesForLeader()
    .subscribe(data =>{
      this.pendingCount = data.leaves.length;
    })
  }

}
