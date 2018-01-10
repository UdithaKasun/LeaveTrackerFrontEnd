import { ModuleWithProviders }  from '@angular/core';  
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../app/login/login.component';
import { LeaveCalendarComponent } from '../app/member/leave-calendar/leave-calendar.component';
import { LeaveHistoryComponent } from '../app/member/leave-history/leave-history.component';
import { MemberComponent } from '../app/member/member.component';
import { LeaderComponent } from '../app/leader/leader.component';
import { PendingApprovalComponent } from './leader/pending-approval/pending-approval.component';
import { UnplannedLeavesComponent } from './leader/unplanned-leaves/unplanned-leaves.component';
import { MemberLeaveHistoryComponent } from './leader/member-leave-history/member-leave-history.component';
 
export const routes: Routes = [  
    {
        path: '',
        component : LoginComponent,
      },
      {
        path: 'login', 
        component : LoginComponent,
      },
      {
        path: 'member', 
        component : MemberComponent,

        children: [
            { path: '', redirectTo: 'leaveCalendar', pathMatch: 'full' },
            { path: 'leaveHistory', component: LeaveHistoryComponent },
            { path: 'leaveCalendar', component: LeaveCalendarComponent }
          ]
      },
      {
        path: 'leader', 
        component : LeaderComponent,
        children: [
          { path: '', redirectTo: 'leaveCalendar', pathMatch: 'full' },
          { path: 'leaveHistory', component: LeaveHistoryComponent },
          { path: 'leaveCalendar', component: LeaveCalendarComponent },
          { path: 'pendingApproval', component: PendingApprovalComponent },
          { path: 'unplannedLeaves', component: UnplannedLeavesComponent },
          { path: 'memberLeaveHistory', component: MemberLeaveHistoryComponent }
        ]
      },

];  
  
export const routing: ModuleWithProviders = RouterModule.forRoot(routes); 