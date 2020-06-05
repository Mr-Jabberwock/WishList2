import { EmailService } from './../services/email.service';
import {Component, OnInit, OnDestroy} from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import {AngularFireDatabase, AngularFireList} from "angularfire2/database"
import { DataService } from '../services/data.service';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { stringify } from 'querystring';

@Component({
    selector: "home",
    templateUrl: "./home.component.html",
    styleUrls: ['./home.component.css' ]
})

export class HomeComponent implements OnInit, OnDestroy{

    wishmaker;
    guest;

    wishList;
    wishes$: Observable<any[]>;
    wishes: AngularFireList<any>;
    reserved$: Observable<any[]>;
    list$: Observable<any[]>;
    list2$: Observable<any[]>;
    newWish;

    wishStatusVissible;
    interests$;
    interestsList;
    
    subscription: Subscription;

    email:string = "";
    wish:string = "";
    link:string = "";
    interest:string = "";

    constructor(
        //private auth: AuthService, 
        private mail: EmailService,
        private service: DataService, 
        private route: ActivatedRoute, 
        public auth: AuthService,
        private db: AngularFireDatabase,
        private router: Router){}

    ngOnInit(){
        this.subscription =  this.route.paramMap
        .subscribe(param =>{
            let wishmaker =  param.get('wishmaker');
            let guest = param.get('guest');
            this.wishmaker = wishmaker;
            this.guest = guest;
            //+param.get('wishmaker'); hvis det var et tal
        })
        
        //hent nøgleværdi for brugerinfo
        this.wishes$ = this.db.list("/Wishmakers/" + this.wishmaker).snapshotChanges();
        this.subscription =  this.wishes$
        .subscribe(res=>{
            this.interests$ = this.db.list("/Wishmakers/" + this.wishmaker + "/" + res[0].key + "/Interests/").valueChanges()
            this.list$ = this.db.list("/Wishmakers/" + this.wishmaker + "/" + res[0].key + "/Wishes/").valueChanges()
            let data1 = res[0].key
            this.newWish = data1;
            this.list$.subscribe(res =>{
                var wishes = [];
                for(var i = 0; i < res.length; i++){
                    wishes[i] = Object.values(res[i]);
                }

                this.wishList = wishes;
                
            })

            this.subscription =  this.interests$.subscribe(res=>{
                var interests = [];
                for(var i = 0; i < res.length; i++){
                    interests[i] = Object.values(res[i]);
                }
                this.interestsList = interests;

            })
        
        })

    }

    addWish(wish: String, link: String){
        var url = "";
        for(var i = 0; i < wish.length; i++){
            if(wish[i] != "." && wish[i] != "/" && wish[i] != ":"){
                url += wish[i]
            }
        }

        var data = {
            Reserved: false,
            Reserver: "",
            Wish: wish,
            Link: link
        }

        this.subscription =  this.service.setData(data, "Wishmakers/" + this.wishmaker, this.newWish+"/Wishes/"+wish)
        .subscribe(res=>{})

        this.wish = " ";
        this.link = " ";
        
    }

    reserved(wish){
        console.log(wish)
        if(wish[1] == false){
            let data = {
                Reserved: true,
                Reserver: this.guest,
                Wish: wish[3],
                Link: wish[0]
            }
            this.subscription = this.service.setData(data, "Wishmakers/" + this.wishmaker, this.newWish+"/Wishes/"+wish[3])
            .subscribe(res=>{}) 
        }else{
            if(wish[2] == this.guest){
                let data = {
                    Reserved: false,
                    Reserver: "",
                    Wish: wish[3],
                    Link: wish[0]

                }
                this.service.setData(data, "Wishmakers/" + this.wishmaker, this.newWish+"/Wishes/"+wish[3])
                .subscribe(res=>{}) 
            }else{
                console.log("I'm afraid I cant let you do that, che")
            }
        }
        
        
    }

    delete(wish){
        this.subscription = this.service.deleteData("Wishmakers", this.wishmaker + "/" + 
        this.newWish + "/Wishes/" + wish[3])
        .subscribe(res=>{});

    }

    interests(interest){
        var interestO = {Interest: interest};
        this.subscription = this.service.setData(interestO, "Wishmakers/" + this.wishmaker, this.newWish+"/Interests/"+interest)
        .subscribe(res=>{}) 
        this.interest = " ";
    }

    sendMail(email){
        var wishlist = [];
        this.wishList.forEach(element => {
            if(element[1] != true || element[2] == this.guest){
               wishlist.push(element[3]);
            }
        });
        this.mail.sendmail(email, wishlist, this.wishmaker)
        .subscribe(res=>{console.log(res)});
        this.email = " ";

        alert("Ønskelisten er blevet sendt til din email");
    }

    ngOnDestroy(){
        this.subscription.unsubscribe();
    }

   
}
