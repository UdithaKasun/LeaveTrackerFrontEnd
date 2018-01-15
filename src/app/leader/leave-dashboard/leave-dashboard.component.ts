import { Component, OnInit } from '@angular/core';


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

@Component({
  selector: 'app-leave-dashboard',
  templateUrl: './leave-dashboard.component.html',
  styleUrls: ['./leave-dashboard.component.css']
})
export class LeaveDashboardComponent implements OnInit {

  events = [];
  constructor() { 
    
  }

  ngOnInit() {
  }

}
