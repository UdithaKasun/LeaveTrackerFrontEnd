import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';

@Component({
  selector: 'app-pending-approval',
  templateUrl: './pending-approval.component.html',
  styleUrls: ['./pending-approval.component.css']
})
export class PendingApprovalComponent implements OnInit {

  constructor() { }

  leaves=[{
    name:"Sameera",
    from : "2018-01-02",
    to: "2018-01-05",
    count: "04"
  },
  {
    name:"Chamindu",
    from : "2018-01-02",
    to: "2018-01-05",
    count: "02"
  },
  {
    name:"Prabath",
    from : "2018-01-02",
    to: "2018-01-05",
    count: "01"
  },
  {
    name:"Kasun",
    from : "2018-01-02",
    to: "2018-01-05",
    count: "03"
  },
  {
    name:"Chamindu",
    from : "2018-01-02",
    to: "2018-01-05",
    count: "02"
  },
  {
    name:"Prabath",
    from : "2018-01-02",
    to: "2018-01-05",
    count: "01"
  },
  {
    name:"Kasun",
    from : "2018-01-02",
    to: "2018-01-05",
    count: "03"
  },
  {
    name:"Chamindu",
    from : "2018-01-02",
    to: "2018-01-05",
    count: "02"
  },
  {
    name:"Prabath",
    from : "2018-01-02",
    to: "2018-01-05",
    count: "01"
  },
  {
    name:"Kasun",
    from : "2018-01-02",
    to: "2018-01-05",
    count: "03"
  },
  {
    name:"Chamindu",
    from : "2018-01-02",
    to: "2018-01-05",
    count: "02"
  },
  {
    name:"Prabath",
    from : "2018-01-02",
    to: "2018-01-05",
    count: "01"
  },
  {
    name:"Kasun",
    from : "2018-01-02",
    to: "2018-01-05",
    count: "03"
  }];

  ngOnInit() {
  }

  approve(){
    swal({
      position: 'center',
      type: 'success',
      title: 'Leave approved',
      showConfirmButton: false,
      timer: 1500
    })
  }

  reject(){
    swal({
      title: 'Are you sure?',
      text: "You won't to disapprove this leave!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reject it!'
    }).then((result) => {
      if (result.value) {
        swal(
          'Rejected!',
          'Your leave has been rejected.',
          'success'
        )
      }
    })
  }

  


}
