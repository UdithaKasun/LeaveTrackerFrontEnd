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
 
import { AuthGuardService as AuthGuard } from './services/auth-guard-service.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AdministratorComponent } from './administrator/administrator.component';
import { AdduserComponent } from './administrator/adduser/adduser.component';
import { EdituserComponent } from './administrator/edituser/edituser.component';

export const routes: Routes = [  
      {
        path: '',
        redirectTo: '/login', pathMatch: 'full',
      },
      {
        path: 'login', 
        component : LoginComponent,
      },
      {
        path: 'member', 
        component : MemberComponent,
        canActivate: [AuthGuard],

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
      {
        path: 'admin', 
        component : AdministratorComponent,
        children: [
            { path: '', redirectTo: 'adduser', pathMatch: 'full' },
            { path: 'adduser', component: AdduserComponent },
            { path: 'edituser', component: EdituserComponent }
          ]
      },
      {
        path: '**', 
        component : PageNotFoundComponent,
      },
];  
  
export const routing: ModuleWithProviders = RouterModule.forRoot(routes); 