import { Component } from '@angular/core';

import { LoginService } from './login/login.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'business-cards';

  constructor(private loginService: LoginService,private router: Router) {
  }

  logout() {
    this.loginService.signOut();
  }

  // isadmin()
  // {
  //   if(this.loginService.userUid.match("iIc0apoc1MS1jrauWo7NXfRXgYv2"))
  //   {
  //     console.log("admin");

  //   }
  //   else
  //   {
  //     console.log(" not admin");
  //     this.router.navigate(['/dashboard']);
  //   }
  // }
}
