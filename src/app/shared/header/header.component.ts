import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  UserName:any;
  constructor(public router:Router) { }

  ngOnInit() {
    this.UserName="Example Username";
  }
  logout(){
    this.router.navigateByUrl('/login');
  }

}
