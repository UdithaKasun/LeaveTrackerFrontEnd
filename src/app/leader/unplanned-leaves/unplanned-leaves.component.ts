import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import swal from 'sweetalert2';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Observable } from 'rxjs/Observable';
import { CalendarMonthViewDay } from "angular-calendar";
import { LeaderServiceService } from '../../services/leader-service.service'
import { Response } from '@angular/http/src/static_response';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { LeaveServiceService } from '../../services/leave-service.service';

const colors: any = {
  red: {
    primary: '#F52F22',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#007cbb',
    secondary: '#FDF1BA'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
  ,
  green : {
    primary: '#85C81A',
    secondary: '#FDF1BA'
  },
  orange : {
    primary: '#EE4A08',
    secondary: '#FDF1BA'
  }

};

export class Employee {
  constructor(public employeeID: string) { }
}

@Component({
  selector: 'app-unplanned-leaves',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './unplanned-leaves.component.html',
  styleUrls: ['./unplanned-leaves.component.css']
})
export class UnplannedLeavesComponent implements OnInit {
  showCalendar: boolean;
  selectedEmp : String;
  @BlockUI() blockUI: NgBlockUI;
  employeeCtrl: FormControl;
  filteredEmpObs: Observable<any[]>;

  employees: Employee[] = [];
  initialLeaveIds = [];
  constructor(public leaderService: LeaderServiceService,private leaveService: LeaveServiceService, private cdRef: ChangeDetectorRef) {
    this.employeeCtrl = new FormControl();
    leaderService.getleaderMembers().subscribe(Response => {
      for (var i = 0; i < Response.length; i++) {
        this.employees.push({ employeeID: Response[i].username })
      }
      this.filteredEmpObs = this.employeeCtrl.valueChanges
        .pipe(
        startWith(''),
        map(state => state ? this.filteredEmp(state) : this.employees.slice())
        );
    })

  }

  ngOnInit(): void {
    this.showCalendar = false;
  }

  refreshLeaves(){
    this.selectMember(this.selectedEmp);
  }

  selectMember(empID) {
    this.selectedEmp = empID;
    this.blockUI.start('Fetching Leave Details...');
    this.events = [];
    this.leaveService.getLeavesForUser(empID)
      .subscribe(data => {
        console.log(data);
        this.leaves = [];
        this.leaves = data.leaves;

        if (this.leaves.length > 0) {
          this.leaves.forEach(leave => {
            if (leave.leave_type == "PLANNED") {

              var pendingEvent = {
                title: 'Pending Approval',
                leave_id: leave.leave_id,
                start: startOfDay(new Date(leave.leave_from_date)),
                end: endOfDay(new Date(leave.leave_to_date)),
                color: colors.green,
                draggable: false,
                resizable: {
                  beforeStart: false,
                  afterEnd: false
                }
              };

              var approvedEvent = {
                title: 'Leave Approved',
                start: startOfDay(new Date(leave.leave_from_date)),
                end: endOfDay(new Date(leave.leave_to_date)),
                color: colors.blue,
                draggable: false,
                resizable: {
                  beforeStart: false,
                  afterEnd: false
                }
              };

              if (leave.leave_status == "PENDING") {
                this.events.push(pendingEvent);
                //this.initialLeaveIds.push(pendingEvent.leave_id);
              }
              else if (leave.leave_status == "APPROVED") {
                this.events.push(approvedEvent);
              }
            }
            else if(leave.leave_type == "UNPLANNED"){
              var unplannedLeave = {
                title: 'Unplanned Leave',
                leave_id: leave.leave_id,
                start: startOfDay(new Date(leave.leave_from_date)),
                end: endOfDay(new Date(leave.leave_to_date)),
                color: colors.orange,
                draggable: false,
                resizable: {
                  beforeStart: false,
                  afterEnd: false
                }
              };
              this.initialLeaveIds.push(leave.leave_id);
              this.events.push(unplannedLeave);
            }
          }
          );
        }
        console.log(this.events);
        //this.showLoad = false;
        this.viewDate = new Date();
        this.cdRef.detectChanges();
        this.blockUI.stop();
        this.showCalendar = true;
      },error => {
        this.blockUI.stop();
        swal("Error","Leaves could not be Fetched","error");
      })
  }

  
  generateLeaves() {
    this.empNewLeaves = [];
    this.empExistingLeaves = [];
    this.events.forEach(leave => {
      var leaveDetails;

      if (leave.title == "Unplanned Leave") {
        if (leave.leave_id == undefined) {
          leaveDetails = {
            user_id: this.selectedEmp,
            leave_from_date: new Date(leave.start).toISOString(),
            leave_to_date: new Date(leave.end).toISOString(),
            leave_count: this.calculateLeaveLength(leave.start, leave.end),
            leave_type: "UNPLANNED",
            leave_status: "OTHER",
            leave_approver_id: window.localStorage['userid'],
            leave_id: ""
          }
        } else {
          leaveDetails = {
            user_id: this.selectedEmp,
            leave_from_date: new Date(leave.start).toISOString(),
            leave_to_date: new Date(leave.end).toISOString(),
            leave_count: this.calculateLeaveLength(leave.start, leave.end),
            leave_type: "UNPLANNED",
            leave_status: "OTHER",
            leave_approver_id: window.localStorage['userid'],
            leave_id: leave.leave_id
          }
        }

        if (leave.leave_id) {
          leaveDetails['leave_id'] = leave.leave_id;
          var alreadyAdded = this.empExistingLeaves.filter(currentLeave => {
            return currentLeave.leave_id == leaveDetails.leave_id;
          });

          if(alreadyAdded.length > 0){
            this.empNewLeaves.push(leaveDetails);
          }
          else{
            this.empExistingLeaves.push(leaveDetails);
          }
        }
        else {
          this.empNewLeaves.push(leaveDetails);
        }
      }
    })

    console.log("Existing Leaves");
    console.log(this.empExistingLeaves);
    console.log("New Leaves");
    console.log(this.empNewLeaves);
  }

  saveLeaves() {
    this.blockUI.start('Saving Leave Data...');
    this.generateLeaves();
    var deleteLeaveIds = [];
    console.log('Initial Leaves *********************************');
    console.log(this.initialLeaveIds);
    console.log('Exisiting Leaves *********************************');
    console.log(this.empExistingLeaves);

    this.initialLeaveIds.forEach(leaveId => {
      var available = false;

      this.empExistingLeaves.forEach(leave => {
        if (leave.leave_id == leaveId) {
          available = true;
        }
      });
      if (!available) {
        deleteLeaveIds.push(leaveId);
      }
    });

    console.log('Delete Leaves *********************************');
    console.log(deleteLeaveIds);

    this.leaveService.saveLeaves(this.empNewLeaves,this.empExistingLeaves,deleteLeaveIds)
        .subscribe(data => {
          this.blockUI.stop();
    swal("Success","Leaves saved successfully","success");
    },err=>{
      this.blockUI.stop();
        swal("Error","Leaves could not be saved","error");
    });
  }
 

  filteredEmp(employeeID: string) {
    console.log("Here : " + employeeID);
    return this.employees.filter(state =>
      state.employeeID.toLowerCase().indexOf(employeeID.toLowerCase()) === 0);
  }



  leaves = [{
    user_id: "U001",
    leave_from_date: "2018-01-17T18:30:00.000Z",
    leave_to_date: "2018-01-17T18:30:00.000Z",
    leave_count: 50,
    leave_type: "PLANNED",
    leave_status: "PENDING",
    leave_approver_id: "L001",
    leave_id: "LEAVE_1515087229697"
  },
  {
    user_id: "U001",
    leave_from_date: "2018-01-19T18:30:00.000Z",
    leave_to_date: "2018-01-23T18:30:00.000Z",
    leave_count: 50,
    leave_type: "PLANNED",
    leave_status: "APPROVED",
    leave_approver_id: "L001",
    leave_id: "LEAVE_1515087229697"
  }
  ];

  empNewLeaves = [];
  empExistingLeaves = [];

  clickedDate: Date;
  view: string = 'month';
  title = 'app';
  viewDate = new Date();
  excludeDays: number[] = [0, 6];
  events = [];

 
  calculateLeaveLength(startDate, endDate) {
    var date1 = new Date(startDate);
    var date2 = new Date(endDate);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays;
  }
  incrementMonth() {
    var date = this.viewDate;
    date.setMonth(date.getMonth() + 1);
    this.viewDate = date;
    console.log(this.viewDate);
  }

  skipWeekends(direction: 'back' | 'forward'): void {
    if (this.view === 'day') {
      if (direction === 'back') {
        while (this.excludeDays.indexOf(this.viewDate.getDay()) > -1) {
          this.viewDate = subDays(this.viewDate, 1);
        }
      } else if (direction === 'forward') {
        while (this.excludeDays.indexOf(this.viewDate.getDay()) > -1) {
          this.viewDate = addDays(this.viewDate, 1);
        }
      }
    }
  }

  

  getStartOfWeek(d) {
    d = new Date(d);
    var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }

  getEndOfWeek(d) {
    d = new Date(d);
    var day = d.getDay();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + (day == 0 ? 0 : 7) - day);
  }

  calculateLeaveWithinWeek(srcDate) {
    var startOfWeek = this.getStartOfWeek(srcDate);
    var endOfWeek = this.getEndOfWeek(srcDate);

    var leaveCount = 0;

    this.events.forEach(event => {
      if (new Date(startOfWeek).getTime() <= new Date(event.start).getTime() && new Date(endOfWeek).getTime() > new Date(event.end).getTime()) {
        var currentLeaves = this.calculateLeaveLength(event.start, event.end);
        leaveCount += currentLeaves;
      }
    });

    return leaveCount;
  }

  getDateDifference(date) {
    var date1 = new Date();
    var date2 = new Date(date);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays;
  }

  showDate(date) {
    var clickedObj = date;
    date = date.day.date;
    var todayDate = new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate();
    var clickedDate = new Date(date).getFullYear() + "/" + (new Date(date).getMonth() + 1) + "/" + new Date(date).getDate();

    var diffDays = this.getDateDifference(date);

    if(clickedObj.day.isPast && diffDays > 7){
      swal("Error", "You can only mark leaves within a week", "error");
      return;
    }

    if(clickedObj.day.isFuture){
      swal("Error", "You cannot mark Future days as Unplanned Leaves", "error");
      return;
    }

    if (clickedObj.day.badgeTotal == 1 && clickedObj.day.events[0].title == "Pending Approval") {
      swal("Error", "Leave is currently Pending Approval", "error");
      return;
    }
   
    if (clickedObj.day.badgeTotal == 1 && clickedObj.day.events[0].title == "Leave Approved") {
      swal("Error", "Leave is already Approved", "error");
      return;
    }

    var startOfDate = this.events.filter(function (item) {
      return new Date(item.start).getTime() == new Date(date).getTime() && item.title != "Leave Approved" && item.title != "Pending Approval";
    });

    var endOfDate = this.events.filter(function (item) {
      var endDate = new Date(item.end).getFullYear() + "/" + (new Date(item.end).getMonth() + 1) + "/" + new Date(item.end).getDate();
      var clickedDate = new Date(date).getFullYear() + "/" + (new Date(date).getMonth() + 1) + "/" + new Date(date).getDate();
      return endDate == clickedDate && item.title != "Leave Approved" && item.title != "Pending Approval";
    });

    var endFound = this.events.filter(function (item) {
      var startDate = new Date(item.start).setDate(new Date(item.start).getDate() - 1);
      var endDate = new Date(startDate).getFullYear() + "/" + (new Date(startDate).getMonth() + 1) + "/" + new Date(startDate).getDate();
      var clickedDate = new Date(date).getFullYear() + "/" + (new Date(date).getMonth() + 1) + "/" + new Date(date).getDate();
      return clickedDate == endDate && item.title != "Leave Approved" && item.title != "Pending Approval";

    });

    var startFound = this.events.filter(function (item) {
      var afterDate = new Date(item.end).setDate(new Date(item.end).getDate() + 1);
      var endDate = new Date(afterDate).getFullYear() + "/" + (new Date(afterDate).getMonth() + 1) + "/" + new Date(afterDate).getDate();
      var clickedDate = new Date(date).getFullYear() + "/" + (new Date(date).getMonth() + 1) + "/" + new Date(date).getDate();
      return clickedDate == endDate && item.title != "Leave Approved" && item.title != "Pending Approval";
    });

    var betweenDays = this.events.filter(function (item) {
      var endofDay = endOfDay(new Date(date));
      return item.title != "Leave Approved" && item.title != "Pending Approval" && new Date(item.start).getTime() < new Date(date).getTime() && new Date(item.end).getTime() > endofDay.getTime();
    });

    var dayAfterLeave = this.events.filter(function (item) {
      var afterDate = new Date(item.start).getFullYear() + "/" + (new Date(item.start).getMonth() + 1) + "/" + new Date(item.start).getDate();
      var checkDate = new Date(new Date(date).setDate(new Date(date).getDate() + 1));
      var clickedBeforeDate = new Date(checkDate).getFullYear() + "/" + (new Date(checkDate).getMonth() + 1) + "/" + new Date(checkDate).getDate();
      return afterDate == clickedBeforeDate && item.title != "Leave Approved" && item.title != "Pending Approval";
    });

    var dayBeforeLeave = this.events.filter(function (item) {
      var beforeDate = new Date(item.end).getFullYear() + "/" + (new Date(item.end).getMonth() + 1) + "/" + new Date(item.end).getDate();
      var checkDate = new Date(new Date(date).setDate(new Date(date).getDate() - 1));
      var clickedBeforeDate = new Date(checkDate).getFullYear() + "/" + (new Date(checkDate).getMonth() + 1) + "/" + new Date(checkDate).getDate();
      return beforeDate == clickedBeforeDate && item.title != "Leave Approved" && item.title != "Pending Approval";
    });

    if (startFound.length > 0 && endFound.length > 0) {
      var startEventIndex = this.events.indexOf(startFound[0]);
      var startevent = this.events[startEventIndex];
      var endEventIndex = this.events.indexOf(endFound[0]);
      var endevent = this.events[endEventIndex];
      var endDate = new Date(endevent.end).getFullYear() + "/" + (new Date(endevent.end).getMonth() + 1) + "/" + new Date(endevent.end).getDate();
      var startDate = new Date(startevent.start).getFullYear() + "/" + (new Date(startevent.start).getMonth() + 1) + "/" + new Date(startevent.start).getDate();

      var leavesCount = this.calculateLeaveWithinWeek(startDate);
      var diffDays = this.getDateDifference(date);

      startevent.end = endOfDay(endDate);
      if (startEventIndex > -1) {
        this.events.splice(startEventIndex, 1);
      }

      var reCalcEnd = this.events.filter(function (item) {
        var startDate = new Date(item.start).setDate(new Date(item.start).getDate() - 1);
        var endDate = new Date(startDate).getFullYear() + "/" + (new Date(startDate).getMonth() + 1) + "/" + new Date(startDate).getDate();
        var clickedDate = new Date(date).getFullYear() + "/" + (new Date(date).getMonth() + 1) + "/" + new Date(date).getDate();
        return clickedDate == endDate && item.title != "Leave Approved" && item.title != "Pending Approval";
      });

      endEventIndex = this.events.indexOf(reCalcEnd[0]);
      if (endEventIndex > -1) {
        this.events.splice(endEventIndex, 1);
      }
      this.events.push(startevent);
      this.viewDate = subDays(this.viewDate, 0);
    }
    else if (dayAfterLeave.length > 0) {
      var index = this.events.indexOf(dayAfterLeave[0]);
      var event = this.events[index];
      var endDate = new Date(event.end).getFullYear() + "/" + (new Date(event.end).getMonth() + 1) + "/" + new Date(event.end).getDate();
      var startDate = new Date(event.start).getFullYear() + "/" + (new Date(event.start).getMonth() + 1) + "/" + new Date(event.start).getDate();

      event.start = startOfDay(new Date(date));
      event.end = endOfDay(endDate);

      var leavesCount = this.calculateLeaveWithinWeek(date) - 1;
      var diffDays = this.getDateDifference(date);
      if (index > -1) {
        this.events.splice(index, 1);
      }

      this.events.push(event);
      this.viewDate = subDays(this.viewDate, 0);
    }
    else if (dayBeforeLeave.length > 0) {
      var index = this.events.indexOf(dayBeforeLeave[0]);
      var event = this.events[index];
      var endDate = new Date(event.end).getFullYear() + "/" + (new Date(event.end).getMonth() + 1) + "/" + new Date(event.end).getDate();
      var startDate = new Date(event.start).getFullYear() + "/" + (new Date(event.start).getMonth() + 1) + "/" + new Date(event.start).getDate();

      event.start = startOfDay(startDate);
      event.end = endOfDay(new Date(date));
      var leavesCount = this.calculateLeaveWithinWeek(date) - 1;
      var diffDays = this.getDateDifference(date);
      if (index > -1) {
        this.events.splice(index, 1);
      }

      this.events.push(event);
      this.viewDate = subDays(this.viewDate, 0);
    }
    else if (betweenDays.length > 0) {
      var index = this.events.indexOf(betweenDays[0]);
      var event = this.events[index];
      var endDate = new Date(event.end).getFullYear() + "/" + (new Date(event.end).getMonth() + 1) + "/" + new Date(event.end).getDate();
      var startDate = new Date(event.start).getFullYear() + "/" + (new Date(event.start).getMonth() + 1) + "/" + new Date(event.start).getDate();

      event.start = startOfDay(startDate);
      event.end = endOfDay(new Date(new Date(date).setDate(new Date(date).getDate() - 1)));

      this.calculateLeaveWithinWeek(startDate);

      var additionalEvent = {
        title: 'Unplanned Leave',
        start: startOfDay(new Date(new Date(date).setDate(new Date(date).getDate() + 1))),
        end: endOfDay(new Date(endDate)),
        color: colors.orange,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      }
      if (index > -1) {
        this.events.splice(index, 1);
      }

      this.events.push(event);
      this.events.push(additionalEvent);
      this.viewDate = subDays(this.viewDate, 0);

    }
    else if (startOfDate.length > 0) {
      var index = this.events.indexOf(startOfDate[0]);
      var event = this.events[index];
      var startDate = new Date(event.end).getFullYear() + "/" + (new Date(event.end).getMonth() + 1) + "/" + new Date(event.end).getDate();
      var endDate = new Date(event.start).getFullYear() + "/" + (new Date(event.start).getMonth() + 1) + "/" + new Date(event.start).getDate();

      this.calculateLeaveWithinWeek(startDate);

      if (startDate != endDate) {
        event.start = startOfDay(new Date(new Date(event.start).setDate(new Date(event.start).getDate() + 1)))
        this.events.push(event);
      }
      if (index > -1) {
        this.events.splice(index, 1);
      }
      this.viewDate = subDays(this.viewDate, 0);
    }
    else if (endOfDate.length > 0) {
      var index = this.events.indexOf(endOfDate[0]);
      var event = this.events[index];
      var startDate = new Date(event.end).getFullYear() + "/" + (new Date(event.end).getMonth() + 1) + "/" + new Date(event.end).getDate();
      var endDate = new Date(event.start).getFullYear() + "/" + (new Date(event.start).getMonth() + 1) + "/" + new Date(event.start).getDate();

      this.calculateLeaveWithinWeek(startDate);

      if (startDate != endDate) {
        event.end = endOfDay(new Date(new Date(date).setDate(new Date(date).getDate() - 1)))
        this.events.push(event);
      }
      if (index > -1) {
        this.events.splice(index, 1);
      }
      this.viewDate = subDays(this.viewDate, 0);
    }
    else {
      var leavesCount = this.calculateLeaveWithinWeek(date);
      var diffDays = this.getDateDifference(date);
      this.events.push({
        title: 'Unplanned Leave',
        start: startOfDay(new Date(date)),
        end: endOfDay(new Date(date)),
        color: colors.orange,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      });
      this.viewDate = subDays(this.viewDate, 0);
    }
    console.log(this.events);
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    console.log("Loading");
    body.forEach(day => {
      if (day.events.length > 0 && day.events[0].title == "Pending Approval") {
        day.cssClass = 'pending-abc';
      }
      else if (day.events.length > 0 && day.events[0].title == "Leave Approved") {
        day.cssClass = 'approvedLeave';
      }
      else if (day.events.length > 0 && day.events[0].title == "Unplanned Leave") {
        day.cssClass = 'unplannedLeave';
      }
    });
  }
}
