import { HeaderComponent } from './../users/header/header.component';
import { AccessGuard } from './../services/auth-gueard.service';
import { AngularFireDatabase } from 'angularfire2/database';
import {Component, OnInit, TestabilityRegistry, OnDestroy} from "@angular/core";
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: "login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.css"]
})

//export var loggedIn = false;
export class LoginComponent implements OnDestroy{

    constructor(
        private service: DataService,
        private auth: AuthService, 
        private authAccess: AccessGuard,
        private router: Router,
        private admin: HeaderComponent){}

    subscription: Subscription;


    signIn(credentials){
        this.subscription = this.service.getData("Users/", credentials.Name)
        .subscribe(data =>{
            if(credentials.Name == Object.values(data)[2] && 
               credentials.Password == Object.values(data)[3]){
                if(Object.values(data)[0] == true){

                    this.router.navigate(["/admin"])
                    this.auth.admin(Object.values(data)[2]);
                    this.auth.guestLogin(Object.values(data)[2]);
                    this.admin.admin(Object.values(data)[2])
                   
                }else if(Object.values(data)[0] == false){
                    
                    this.auth.login(Object.values(data)[2]);
                    this.authAccess.setAccess(true);
                    this.router.navigate(["/Users/"+Object.values(data)[2]])   
                }
            }
        })
    }

    ngOnDestroy(){
        this.subscription.unsubscribe();
    }
}