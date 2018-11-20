import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { HttpClientModule } from '@angular/common/http';
import { WebcamModule } from 'ngx-webcam';

import { AppRoutingModule } from './app-routing.module';

import { AuthGuard } from './login/auth.guard';

import { firebaseConfig } from '../environments/environment';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HistoryComponent } from './history/history.component';

import { LoginService } from './login/login.service';
import { CloudVisionService } from './service/cloud-vision.service';

import { BusinessCardDetailComponent } from './business-card-detail/business-card-detail.component';
// import { CreateCardComponent } from './businesscard/create-card/create-card.component';
// import { CardDetailsComponent } from './businesscard/card-details/card-details.component';
// import { CardListComponent } from './businesscard/card-list/card-list.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HistoryComponent,
    BusinessCardDetailComponent,
    // CreateCardComponent,
    // CardDetailsComponent,
    // CardListComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    HttpClientModule,
    WebcamModule,
    AppRoutingModule
  ],
  providers: [LoginService, AuthGuard, CloudVisionService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
