import { Injectable } from '@angular/core';
import { ApiService } from './api-service.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { User } from './models/User';
import { JwtService } from './jwt-service.service';

@Injectable()
export class UserService {

  private currentUserSubject = new BehaviorSubject<User>(new User());
  public currentUser = this.currentUserSubject.asObservable().distinctUntilChanged();

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();
  public isLogged = false;

  public userType = "";

  constructor(private apiService: ApiService, private jwtService : JwtService) {

  }

  //Attemp Login to the System
  attemptLogin(credentials : User) {
    this.destroyAuth();
    return this.apiService.post('/users/login', {user: credentials})
    .map(
      data => {
        this.userType = String(data.role).toLocaleLowerCase();
        this.setAuth(data.user);
        return data;
      }
    );
  }

  registerUser(userdetails) {
    return this.apiService.post('/users', {user: userdetails})
    .map(
      data => {
        return data;
      }
    );
  }

  updateUser(userdetails) {
    return this.apiService.put('/users', {user: userdetails})
    .map(
      data => {
        return data;
      }
    );
  }

  changePassword(userdetails) {
    return this.apiService.post('/users/changepassword', {user: userdetails})
    .map(
      data => {
        return data;
      }
    );
  }

  resetAccount(userdetails) {
    return this.apiService.post('/users/resetAccount', {user: userdetails})
    .map(
      data => {
        return data;
      }
    );
  }
  loadLeads() {
    return this.apiService.get('/leaders')
    .map(
      data => {
        return data;
      }
    );
  }

  getUsers() {
    return this.apiService.get('/systemusers')
    .map(
      data => {
        return data;
      }
    );
  }

  //Store Authorization Information
  setAuth(user: User) {
    // Save JWT sent from server in localstorage
    this.jwtService.saveToken(user.token);
    // Set current user data into observable
    this.currentUserSubject.next(user);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);

    this.isLogged = true;
    console.log("isLogged : " + this.isLogged)
  }

  destroyAuth() {
    // Remove JWT from localstorage
    this.jwtService.destroyToken();
    // Set current user to an empty object
    this.currentUserSubject.next(new User());
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);
    
    this.isLogged = false;
  }

  errorHandler(error: any): void {
    console.log(error);
  }

}