import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from '../../services/user-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public router:Router, private userService : UserService) { }
  userName = "";

  ngOnInit() {
    this.userName = window.localStorage['userid'];
  }

  logout(){
    this.userService.destroyAuth();
    this.router.navigateByUrl('/login');
  }

}
