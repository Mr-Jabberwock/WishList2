import { DataService } from './../services/data.service';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import {Component, OnInit, OnDestroy} from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
    selector: "chat",
    templateUrl: "./chat.component.html",
    styleUrls: ["./chat.component.css"]
})

export class ChatComponent implements OnInit, OnDestroy{

    constructor(
        public service: DataService, 
        private route: ActivatedRoute, 
        private db: AngularFireDatabase,
        private auth: AuthService){}

    guest;
    wishmaker;
    messages$;
    itemsRef$: AngularFireList<any[]>;

    message:string = "";

    subscription: Subscription;

    ngOnInit(){
       this.subscription = this.route.paramMap
             .subscribe(params=>{
                this.guest = params.get('guest')
                this.wishmaker = params.get('wishmaker')
        })
        
        //hent data
        this.messages$ = this.db.list('/Chats/' + this.wishmaker).valueChanges();
    }

    send(newMessage){
       //this.itemsRef$.push(<any>[{Name: this.guest , Message: newMessage}])
       var data = {Name: this.guest, Message: newMessage};
       this.subscription = this.service.insertData(data, "Chats", this.wishmaker)
       .subscribe(res=>{})
       this.message = " ";
    }

    ngOnDestroy(){
       this.subscription.unsubscribe();
    }
    

}