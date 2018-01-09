import { Component, ChangeDetectionStrategy, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
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
import { CalendarMonthViewDay } from 'angular-calendar';
import { LeaveServiceService } from '../../services/leave-service.service';

const colors: any = {
  red: {
    primary: '#ad2121',
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
};


@Component({
  selector: 'app-leave-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './leave-calendar.component.html',
  styleUrls: ['./leave-calendar.component.css']
})
export class LeaveCalendarComponent implements OnInit {

  constructor(private leaveService: LeaveServiceService, private cdRef: ChangeDetectorRef) {

  }
  showLoad = true;

  initialLeaveIds = [];
  ngOnInit(): void {
    this.showLoad = true;
    this.loadEvents();
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach(day => {
      if (day.events.length > 0 && day.events[0].title == "Pending Approval") {
        day.cssClass = 'pendingLeave';
      }
      else if (day.events.length > 0 && day.events[0].title == "Leave Approved") {
        day.cssClass = 'approvedLeave';
      }
    });
  }

  leaves2 = [{
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

  leaves = [];

  empNewLeaves = [];
  empExistingLeaves = [];
  empDeleteLeaves = [];
  clickedDate: Date;
  view: string = 'month';
  title = 'app';
  viewDate = new Date();
  excludeDays: number[] = [0, 6];
  events = [];

  loadEvents() {

    this.leaveService.getLeavesByUserId()
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
                color: colors.yellow,
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
                this.initialLeaveIds.push(pendingEvent.leave_id);
              }
              else if (leave.leave_status == "APPROVED") {
                this.events.push(approvedEvent);
              }
            }
          }
          );
        }
        console.log(this.events);
        this.showLoad = false;
        this.cdRef.detectChanges();
      })
    console.log(this.showLoad);
  }

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

  generateLeaves() {
    this.empNewLeaves = [];
    this.empExistingLeaves = [];
    this.events.forEach(leave => {
      var leaveDetails;

      if (leave.title != "Leave Approved") {
        if (leave.leave_id == undefined) {
          leaveDetails = {
            user_id: window.localStorage['userid'],
            leave_from_date: new Date(leave.start).toISOString(),
            leave_to_date: new Date(leave.end).toISOString(),
            leave_count: this.calculateLeaveLength(leave.start, leave.end),
            leave_type: "PLANNED",
            leave_status: "PENDING",
            leave_approver_id: window.localStorage['leadid'],
            leave_id: ""
          }
        } else {
          leaveDetails = {
            user_id: window.localStorage['userid'],
            leave_from_date: new Date(leave.start).toISOString(),
            leave_to_date: new Date(leave.end).toISOString(),
            leave_count: this.calculateLeaveLength(leave.start, leave.end),
            leave_type: "PLANNED",
            leave_status: "PENDING",
            leave_approver_id: window.localStorage['leadid'],
            leave_id: leave.leave_id
          }


        }

        if (leave.leave_id) {
          leaveDetails['leave_id'] = leave.leave_id;
          this.empExistingLeaves.push(leaveDetails);
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

  saveLeaves() {
    this.generateLeaves();

    if (this.empNewLeaves.length > 0) {
      this.leaveService.addNewLeaves(this.empNewLeaves)
        .subscribe(data => {
          alert("New Leaves Saved");
        })
    }

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

    // console.log(deleteLeaveIds);
    if (this.empExistingLeaves.length > 0) {

      this.leaveService.updateLeaves(this.empExistingLeaves)
        .subscribe(data => {
          alert("Existing Leaves Updated");
        })
    }

    if (deleteLeaveIds.length > 0) {
      this.leaveService.deleteLeaves(deleteLeaveIds)
        .subscribe(data => {
          alert("Leaves Deleted");
        })
    }




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

    if (clickedObj.day.isToday) {
      swal("Oops", "You cannot place leaves for today", "warning");
      return;
    }

    var diffDays = this.getDateDifference(date);

    if (clickedObj.day.isPast && diffDays > 2 && clickedObj.day.badgeTotal == 1 && clickedObj.day.events[0].title == "Pending Approval") {
      swal("Oops", "You cannot modify leaves applied for past dates" + diffDays, "warning");
      return;
    }

    if (clickedObj.day.isPast && diffDays > 2) {
      swal("Oops", "You cannot place leaves for past dates" + diffDays, "warning");
      return;
    }

    if (clickedObj.day.isFuture && diffDays < 7) {
      swal("Oops", "Leaves can only be planned prior to a week", "warning");
      return;
    }


    if (clickedObj.day.badgeTotal == 1 && clickedObj.day.events[0].title == "Leave Approved") {

      swal("Oops", "Leave is already Approved", "warning");
      return;
    }

    var startOfDate = this.events.filter(function (item) {
      return new Date(item.start).getTime() == new Date(date).getTime() && item.title != "Leave Approved";
    });

    var endOfDate = this.events.filter(function (item) {
      var endDate = new Date(item.end).getFullYear() + "/" + (new Date(item.end).getMonth() + 1) + "/" + new Date(item.end).getDate();
      var clickedDate = new Date(date).getFullYear() + "/" + (new Date(date).getMonth() + 1) + "/" + new Date(date).getDate();
      return endDate == clickedDate && item.title != "Leave Approved";
    });

    var endFound = this.events.filter(function (item) {
      var startDate = new Date(item.start).setDate(new Date(item.start).getDate() - 1);
      var endDate = new Date(startDate).getFullYear() + "/" + (new Date(startDate).getMonth() + 1) + "/" + new Date(startDate).getDate();
      var clickedDate = new Date(date).getFullYear() + "/" + (new Date(date).getMonth() + 1) + "/" + new Date(date).getDate();
      return clickedDate == endDate && item.title != "Leave Approved";

    });

    var startFound = this.events.filter(function (item) {
      var afterDate = new Date(item.end).setDate(new Date(item.end).getDate() + 1);
      var endDate = new Date(afterDate).getFullYear() + "/" + (new Date(afterDate).getMonth() + 1) + "/" + new Date(afterDate).getDate();
      var clickedDate = new Date(date).getFullYear() + "/" + (new Date(date).getMonth() + 1) + "/" + new Date(date).getDate();
      return clickedDate == endDate && item.title != "Leave Approved";
    });

    var betweenDays = this.events.filter(function (item) {
      var endofDay = endOfDay(new Date(date));
      return item.title != "Leave Approved" && new Date(item.start).getTime() < new Date(date).getTime() && new Date(item.end).getTime() > endofDay.getTime();
    });

    var dayAfterLeave = this.events.filter(function (item) {
      var afterDate = new Date(item.start).getFullYear() + "/" + (new Date(item.start).getMonth() + 1) + "/" + new Date(item.start).getDate();
      var checkDate = new Date(new Date(date).setDate(new Date(date).getDate() + 1));
      var clickedBeforeDate = new Date(checkDate).getFullYear() + "/" + (new Date(checkDate).getMonth() + 1) + "/" + new Date(checkDate).getDate();
      return afterDate == clickedBeforeDate && item.title != "Leave Approved";
    });

    var dayBeforeLeave = this.events.filter(function (item) {
      var beforeDate = new Date(item.end).getFullYear() + "/" + (new Date(item.end).getMonth() + 1) + "/" + new Date(item.end).getDate();
      var checkDate = new Date(new Date(date).setDate(new Date(date).getDate() - 1));
      var clickedBeforeDate = new Date(checkDate).getFullYear() + "/" + (new Date(checkDate).getMonth() + 1) + "/" + new Date(checkDate).getDate();
      return beforeDate == clickedBeforeDate && item.title != "Leave Approved";
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

      if (leavesCount == 1 && diffDays < 7) {
        swal("Oops", "Leaves can only be planned prior to a week", "warning");
        return;
      }
      else if (leavesCount == 2 && diffDays < 14) {
        swal("Oops", "More than 3 leaves have to planned before 2 weeks", "warning");
        return;
      }

      startevent.end = endOfDay(endDate);
      if (startEventIndex > -1) {
        this.events.splice(startEventIndex, 1);
      }

      var reCalcEnd = this.events.filter(function (item) {
        var startDate = new Date(item.start).setDate(new Date(item.start).getDate() - 1);
        var endDate = new Date(startDate).getFullYear() + "/" + (new Date(startDate).getMonth() + 1) + "/" + new Date(startDate).getDate();
        var clickedDate = new Date(date).getFullYear() + "/" + (new Date(date).getMonth() + 1) + "/" + new Date(date).getDate();
        return clickedDate == endDate && item.title != "Leave Approved";
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

      if (leavesCount == 1 && diffDays < 7) {
        swal("Oops", "Leaves can only be planned prior to a week", "warning");
        var dayAfterDate = new Date(event.start).setDate(new Date(event.start).getDate() + 1);
        event.start = startOfDay(dayAfterDate);
        if (index > -1) {
          this.events.splice(index, 1);
        }
        this.events.push(event);
        this.viewDate = subDays(this.viewDate, 0);
        return;
      }
      else if (leavesCount == 2 && diffDays < 14) {
        swal("Oops", "More than 3 leaves have to planned before 2 weeks", "warning");
        var dayAfterDate = new Date(event.start).setDate(new Date(event.start).getDate() + 1);
        event.start = startOfDay(dayAfterDate);
        if (index > -1) {
          this.events.splice(index, 1);
        }
        this.events.push(event);
        this.viewDate = subDays(this.viewDate, 0);
        return;
      }

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

      // var leaveLength = this.calculateLeaveLength(event.start, event.end);
      // var currentLength = this.calculateLeaveLength(new Date(), event.end);
      // if (leaveLength >= 3 && currentLength < 14) {
      //   swal("Oops", "More than 3 leaves have to planned before 2 weeks", "warning");
      //   return;
      // }

      var leavesCount = this.calculateLeaveWithinWeek(date) - 1;
      var diffDays = this.getDateDifference(date);

      if (leavesCount == 1 && diffDays < 7) {
        swal("Oops", "Leaves can only be planned prior to a week", "warning");
        var dayBeforeDate = new Date(event.end).setDate(new Date(event.end).getDate() - 1);
        event.end = endOfDay(dayBeforeDate);
        if (index > -1) {
          this.events.splice(index, 1);
        }
        this.events.push(event);
        this.viewDate = subDays(this.viewDate, 0);
        return;
      }
      else if (leavesCount == 2 && diffDays < 14) {
        swal("Oops", "More than 3 leaves have to planned before 2 weeks", "warning");
        var dayBeforeDate = new Date(event.end).setDate(new Date(event.end).getDate() - 1);
        event.end = endOfDay(dayBeforeDate);
        if (index > -1) {
          this.events.splice(index, 1);
        }
        this.events.push(event);
        this.viewDate = subDays(this.viewDate, 0);
        return;
      }

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
        title: 'Pending Approval',
        start: startOfDay(new Date(new Date(date).setDate(new Date(date).getDate() + 1))),
        end: endOfDay(new Date(endDate)),
        color: colors.yellow,
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

      if (leavesCount == 1 && diffDays < 7) {
        swal("Oops", "Leaves can only be planned prior to a week", "warning");
        return;
      }
      else if (leavesCount == 2 && diffDays < 14) {
        swal("Oops", "More than 3 leaves have to planned before 2 weeks", "warning");
        return;
      }
      this.events.push({
        title: 'Pending Approval',
        start: startOfDay(new Date(date)),
        end: endOfDay(new Date(date)),
        color: colors.yellow,
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
}
