import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ClarityModule } from "clarity-angular";
import { CalendarModule } from 'angular-calendar';
import { routing } from '../app/Router';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { HttpModule } from '@angular/http';
import {ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { VerticalnavComponent } from './shared/verticalnav/verticalnav.component';
import { LoginComponent } from './login/login.component';
import { LeaveCalendarComponent } from './member/leave-calendar/leave-calendar.component';
import { LeaveHistoryComponent } from './member/leave-history/leave-history.component';
import { MemberComponent } from './member/member.component';
import { LeaderVerticalnavComponent } from './shared/leader-verticalnav/leader-verticalnav.component';
import { LeaderComponent } from './leader/leader.component';
import { PendingApprovalComponent } from './leader/pending-approval/pending-approval.component';
import { UnplannedLeavesComponent } from './leader/unplanned-leaves/unplanned-leaves.component';
import { MemberLeaveHistoryComponent } from './leader/member-leave-history/member-leave-history.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    VerticalnavComponent,
    LoginComponent,
    LeaveCalendarComponent,
    LeaveHistoryComponent,
    MemberComponent,
    LeaderVerticalnavComponent,
    LeaderComponent,
    PendingApprovalComponent,
    UnplannedLeavesComponent,
    MemberLeaveHistoryComponent
  ],
  imports: [
    routing,
    BrowserModule,
    ClarityModule.forRoot(),
    CalendarModule.forRoot(),
    FormsModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MaterialModule,
    HttpModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
