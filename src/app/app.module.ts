import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ClarityModule } from "clarity-angular";
import { CalendarModule } from 'angular-calendar';
import { routing } from '../app/Router';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { VerticalnavComponent } from './shared/verticalnav/verticalnav.component';
import { LoginComponent } from './login/login.component';
import { LeaveCalendarComponent } from './member/leave-calendar/leave-calendar.component';
import { LeaveHistoryComponent } from './member/leave-history/leave-history.component';
import { MemberComponent } from './member/member.component';
import { UserService } from './services/user-service.service';
import { ApiService } from './services/api-service.service';
import { JwtService } from './services/jwt-service.service';
import { AuthGuardService as AuthGuard } from './services/auth-guard-service.service';
import { HttpModule } from '@angular/http';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LeaveServiceService } from './services/leave-service.service';
import { AdministratorComponent } from './administrator/administrator.component';
import { ContentviewComponent } from './administrator/contentview/contentview.component';
import { AdduserComponent } from './administrator/adduser/adduser.component';
import { EdituserComponent } from './administrator/edituser/edituser.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    VerticalnavComponent,
    LoginComponent,
    LeaveCalendarComponent,
    LeaveHistoryComponent,
    MemberComponent,
    PageNotFoundComponent,
    AdministratorComponent,
    ContentviewComponent,
    AdduserComponent,
    EdituserComponent
  ],
  imports: [
    routing,
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    ClarityModule.forRoot(),
    CalendarModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [UserService,ApiService,JwtService,AuthGuard,LeaveServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
