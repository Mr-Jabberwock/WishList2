import { AngularFireStorage } from '@angular/fire/storage';
import { EmailService } from './services/email.service';
import { HeaderComponent } from './users/header/header.component';
import { AuthService } from './services/auth.service';
import { RoutingService } from './services/routing.service';
import { FileUploadService} from './services/fileupload.service'
import { environment } from './../environments/environment';
import { GuestComponent } from './guest/guest.component';
import { RouterModule, CanActivate } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from "angularfire2";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';
import {ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WishmakerComponent } from './wishmaker/wishmaker.component';
import { DataService } from './services/data.service';
import { AdminComponent } from './users/admin/admin.component';
import { AuthGuard, GuestGuard, AccessGuard, UserGuard } from './services/auth-gueard.service';//
import { JwtModule } from '@auth0/angular-jwt';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ChatComponent,
    WishmakerComponent,
    GuestComponent,
    AdminComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule.forRoot([
      {path: 'guest', component: GuestComponent},
      {path: 'wishmakers/:guest/:wishmaker', component: HomeComponent}, //, , canActivate: [GuestGuard, AccessGuard]
      {path: 'Users/:wishmaker', component: HomeComponent, canActivate: [UserGuard, AccessGuard]},
      {path: 'wishmakers/:guest', component: WishmakerComponent},
      {path: 'login', component: LoginComponent},
      {path: 'admin', component: AdminComponent, canActivate: [AuthGuard]}, 
      {path: 'chat/:guest/:wishmaker', component: ChatComponent}
    ]),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
     RoutingService,
     AuthService,
     DataService,
     EmailService,
     FileUploadService,
     AuthGuard,
     UserGuard,
     GuestGuard,
     AccessGuard,
     HeaderComponent,
     AngularFireStorage
     //EmailService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
