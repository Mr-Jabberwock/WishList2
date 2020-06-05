import { EmailService } from './../../services/email.service';
import { DataService } from './../../services/data.service';
import {Component, OnInit, Input, Output, OnDestroy} from "@angular/core";
import { Subscription } from 'rxjs';

@Component({
    selector: "admin",
    templateUrl: "./admin.component.html",
    styleUrls:["./admin.component.css"]
})

export class AdminComponent implements OnDestroy{
    
    admin = false;

    name:string = "";
    pass:string = "";
    guestPass:string ="";
    email:string = "";

    checked(event){}

    subscription: Subscription;

    constructor(private service: DataService,
                private mailService: EmailService){}

    createUser(Name, Password, GuestPassword, Email?){

        var user = {"Admin": this.admin, "Name": Name, "Password": Password, "Email": Email};
        var wishmaker = {"Name": Name, "Password": GuestPassword};
        console.log(user);

        //indsæt data i users firebase tabellen
        this.subscription = this.service.setData(user, "Users", Name)
        .subscribe(data =>{})
        
        //indsæt data i wishmakers firebase tabellen
        this.subscription = this.service.insertData(wishmaker, "Wishmakers", Name)
        .subscribe(returnData =>{})

        this.subscription = this.mailService.sendWelcomMessage(Email, Name, Password)
        .subscribe(res=>{});

        this.name = " ";
        this.pass = " ";
        this.guestPass = " ";
        this.email = " ";

        alert("Brugeren er blevet oprettet")
    }

    ngOnDestroy(){
        this.subscription.unsubscribe();
    }

}