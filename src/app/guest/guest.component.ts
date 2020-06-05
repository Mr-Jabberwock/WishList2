import { AuthService } from './../services/auth.service';
import {Component, OnInit, OnDestroy} from "@angular/core";
import {AngularFireDatabase, AngularFireList} from "angularfire2/database"
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: "guest",
    templateUrl: "./guest.component.html",
    styleUrls: ["./guest.component.css"]
})

export class GuestComponent implements OnInit, OnDestroy{
    guests: any[];
    itemsRef$: AngularFireList<any[]>;
    guest$;
    newGuest;

    subscription: Subscription;
 
    constructor(
        private service: DataService, 
        private auth: AuthService,
        private router: Router){}

    ngOnInit(){
        this.auth.logOut();
        this.service.getData("Guests")
        .subscribe(guests =>{
            this.guests = Object.values(guests);
        })
    }

    ngOnDestroy(){
        this.subscription.unsubscribe();
    }
    
    add(guest: String){
        var basic = [];
        for(var i = 0; i < this.guests.length; i++){
            basic[i] = this.guests[i][0];
        }

        var guestO = {Guest: guest}

        console.log(guestO)

        if(!basic.includes(guest.toUpperCase)){
           this.subscription = this.service.setData(guestO, "Guests", guest.toUpperCase())
            .subscribe(res=>{})
        }
        
        this.auth.guestLogin(guest);
        this.router.navigate(["/wishmakers/" + guest.toUpperCase()])
        
    }
    
}
