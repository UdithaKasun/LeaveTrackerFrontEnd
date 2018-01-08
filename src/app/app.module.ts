import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ClarityModule } from "clarity-angular";
import { CalendarModule } from 'angular-calendar';
import { routing } from '../app/Router';

import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { VerticalnavComponent } from './shared/verticalnav/verticalnav.component';
import { LoginComponent } from './login/login.component';
import { LeaveCalendarComponent } from './member/leave-calendar/leave-calendar.component';
import { LeaveHistoryComponent } from './member/leave-history/leave-history.component';
import { MemberComponent } from './member/member.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    VerticalnavComponent,
    LoginComponent,
    LeaveCalendarComponent,
    LeaveHistoryComponent,
    MemberComponent
  ],
  imports: [
    routing,
    BrowserModule,
    ClarityModule.forRoot(),
    CalendarModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
