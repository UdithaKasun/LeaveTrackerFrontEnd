import { ModuleWithProviders }  from '@angular/core';  
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../app/login/login.component';
import { LeaveCalendarComponent } from '../app/member/leave-calendar/leave-calendar.component';
import { LeaveHistoryComponent } from '../app/member/leave-history/leave-history.component';
import { MemberComponent } from '../app/member/member.component';
 
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
            { path: '', redirectTo: 'leaveHistory', pathMatch: 'full' },
            { path: 'leaveHistory', component: LeaveHistoryComponent },
            { path: 'leaveCalendar', component: LeaveCalendarComponent }
          ]
      }
];  
  
export const routing: ModuleWithProviders = RouterModule.forRoot(routes); 