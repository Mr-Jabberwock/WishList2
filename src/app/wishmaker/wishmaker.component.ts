import {Component, OnInit, OnDestroy} from "@angular/core";
import {AngularFireDatabase, AngularFireList} from "angularfire2/database"
import {Observable, Subscription} from "rxjs";
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { AccessGuard } from '../services/auth-gueard.service';

@Component({
    selector: "wishmaker",
    templateUrl: "./wishmaker.component.html",
    styleUrls: ["./wishmaker.component.css"]
})

export class WishmakerComponent implements OnInit, OnDestroy{
    wishmakers;
    wishmakers$;
    object1;
    passarray = [];

    guest;
    wishmaker;

    subscription:Subscription;

    constructor(
        private service: DataService, 
        private route: ActivatedRoute, 
        private router: Router, 
        private access: AccessGuard,
        private auth: AuthService,
        private db: AngularFireDatabase){}

    Password: String = "";
    PassVal: String = "";
    Name: String = "";

    ngOnInit(){
        //udtræk gæste paramtren
        this.subscription = this.route.paramMap
        .subscribe(param =>{
            let guest = param.get("guest")
            this.guest = guest;
            let wishmaker = param.get("wishmaker");
            this.wishmaker = wishmaker;
        })

        console.log(this.guest);
        
        this.subscription = this.service.getData("Wishmakers")
        .subscribe(wishmakers => {
            this.wishmakers = Object.values(wishmakers);

            this.object1 = Object.values(wishmakers);
            for(var i = 0; i < this.object1.length; i++){
               this.wishmakers[i] = Object.values(Object.values(this.object1)[i])[0];
               this.passarray[i] = Object.values(Object.values(this.object1)[i])[0];
            }
        })
        this.wishmakers$ = this.db.object('Wishmaker').valueChanges()  
    }

    //verificer password
    submit(name: String, password: String){
        this.Name = name;
        this.Password = password;
        for(var i = 0; i < this.passarray.length; i++){
            if(this.passarray[i].Name == name && this.passarray[i].Password == password){
                this.PassVal = this.passarray[i].Password;
                this.access.setAccess(true);
                this.router.navigate(["/wishmakers/" + this.guest + "/" + name])
            }
        }
    }

    deleteUser(wishmaker){
        console.log(wishmaker.Name);

        this.subscription = this.service.deleteData("Wishmakers", wishmaker.Name).subscribe(res=>{});
        this.service.deleteData("Users", wishmaker.Name).subscribe(res=>{});
        this.service.deleteData("Chats", wishmaker.Name).subscribe(res=>{});
    }

    ngOnDestroy(){
        this.subscription.unsubscribe();
    }
    
    
}