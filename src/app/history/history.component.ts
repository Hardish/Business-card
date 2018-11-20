import { Component, OnInit } from '@angular/core';

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../login/login.service';
import { map, take, tap } from 'rxjs/operators';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  history: string[];

  // constructor(private dbService: DatabaseService) {

  // }


  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      
      return this.loginService.adminUser.pipe(
        take(1),
        map((user => !!user),
        tap((isAdmin) => {
          if (!isAdmin) {
            console.log('access denied');
            this.router.navigate(['']);
          }
        })
      ))
  }
  ngOnInit() {

 

    // this.dbService.getAllHistory().subscribe(
    //   (response) => {
    //     console.log('Get history from Firebase successfully!');
    //     console.log(response);

    //     this.history = response;
    //   },
    //   (error) => {
    //     console.log('Failed to get history from Firebase!');
    //     console.log(error);
    //   }
    // );
  }

}
