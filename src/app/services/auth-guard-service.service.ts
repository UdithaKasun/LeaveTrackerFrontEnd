import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserService } from './user-service.service';

@Injectable()
export class AuthGuardService implements CanActivate{
  
  isUserLogged : boolean=false;
  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    console.log("IsLogged : " + this.userService.isLogged);

    const expectedRole = route.data.expectedRole;
    var index = expectedRole.indexOf(this.userService.userType);
    console.log("User Index " + index);
    console.log(expectedRole);
    if(this.isUserLogged && index != -1){
      return true;
    }
    else{
      this.router.navigate(['/login']);
      this.userService.destroyAuth();
      return false;
    };
  }

  constructor(private router : Router,private userService : UserService) { 
    this.userService.isAuthenticated
    .subscribe(status => {
      if(status){
        console.log('Setting hhhhh')
        this.isUserLogged = true;
        console.log(this.userService.userType);
      }
      else{
        this.isUserLogged = false;
      }
    })
  }

}