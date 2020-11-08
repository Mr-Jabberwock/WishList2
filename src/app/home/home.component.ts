import { EmailService } from './../services/email.service';
import {Component, OnInit, OnDestroy, Inject} from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import {AngularFireDatabase, AngularFireList} from "angularfire2/database"
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { DataService } from '../services/data.service';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { stringify } from 'querystring';
import {FileUploadService} from '../services/fileupload.service'
import { finalize } from 'rxjs/operators';

@Component({
    selector: "home",
    templateUrl: "./home.component.html",
    styleUrls: ['./home.component.css' ]
})

export class HomeComponent implements OnInit, OnDestroy{
    selectedImage: any = null;
    url:string;
    id: string;
    file:string;  

    wishmaker;
    guest;

    wishList;
    wishes$: Observable<any[]>;
    wishes: AngularFireList<any>;
    reserved$: Observable<any[]>;
    list$: Observable<any[]>;
    list2$: Observable<any[]>;
    newWish;
    base64textString = [];

    wishStatusVissible;
    interests$;
    interestsList;
    
    subscription: Subscription;

    email:string = "";
    wish:string = "";
    link:string = "";
    interest:string = "";
    image:File = null;

    viewMode = false;
    descriptionViewMode = false;
    desTxtVM = false;
    linkViewMode = false;
    currentWish = "";
    currentDescription = "";
    currentLink = "";

    constructor(
        //private auth: AuthService, 
        private mail: EmailService,
        private service: DataService, 
        private route: ActivatedRoute, 
        public auth: AuthService,
        private db: AngularFireDatabase,
        private fileUpload: FileUploadService,
        private router: Router,
        @Inject(AngularFireStorage) private storage: AngularFireStorage, 
        @Inject(FileUploadService) private fileService: FileUploadService){}

    ngOnInit(){
        this.fileService.getImageDetailList();
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
        console.log("/Wishmakers/" + this.wishmaker);
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

        this.save();

        console.log(wish);
        console.log(link);

        var wishName = this.removeDots(wish);
        if(link.substr(0,4) != "http"){
            link = "no link";
        }
        var data = {
            Reserved: false,
            Reserver: "",
            Wish: wish,
            Link: link,
            Description: "Beskrivelse",
            Image: " " + this.id
        }

        console.log(this.id);

        this.subscription =  this.service.setData(data, "Wishmakers/" + this.wishmaker, this.newWish+"/Wishes/"+wishName)
        .subscribe(res=>{})

        this.wish = null;
        this.link = null;
        
    }

    reserved(wish){
        var wishName = this.removeDots(wish[5]);

        if(wish[3] == false){
            let data = {
                Reserved: true,
                Reserver: this.guest,
                Wish: wish[5],
                Link: wish[2],
                Description: wish[0],
                Image: wish[1]
            }
            this.subscription = this.service.setData(data, "Wishmakers/" + this.wishmaker, this.newWish+"/Wishes/"+wishName)
            .subscribe(res=>{}) 
        }else{
            if(wish[4] == this.guest){
                let data = {
                    Reserved: false,
                    Reserver: "",
                    Wish: wish[5],
                    Link: wish[2],
                    Description: wish[0],
                    Image: wish[1]

                }
                this.service.setData(data, "Wishmakers/" + this.wishmaker, this.newWish+"/Wishes/"+wishName)
                .subscribe(res=>{}) 
            }else{
                console.log("I'm afraid I cant let you do that, che")
            }
        }
        
        
    }

    deleteWish(wish){
        var wishName = this.removeDots(wish[5]);
        console.log(wishName)

        this.subscription = this.service.deleteData("Wishmakers", this.wishmaker + "/" + 
        this.newWish + "/Wishes/" + wishName)
        .subscribe(res=>{});

    }

    interests(interest){
        var interestO = {Interest: interest};
        this.subscription = this.service.setData(interestO, "Wishmakers/" + this.wishmaker, this.newWish+"/Interests/"+interest)
        .subscribe(res=>{}) 
        this.interest = null;
    }

    sendMail(email){
        var wishlist = [];
        this.wishList.forEach(element => {
            //hvis reserved er falsk eller reserver er denne gæst
            if(element[2] == false || element[3] == this.guest){
               wishlist.push(element[4]);
            }
        });
        this.mail.sendmail(email, wishlist, this.wishmaker)
        .subscribe(res=>{});
        this.email = null;

        alert("Ønskelisten er blevet sendt til din email");
    }

    editText(newText, wish){
        
        this.currentWish = wish[5];
        var wishName = this.removeDots(newText);

        console.log(this.currentWish, newText)

        if(this.viewMode == false){
            this.viewMode = true
        }else if (this.viewMode == true && newText != ""){
            let data = {
                Reserved: wish[3],
                Reserver: this.guest,
                Wish: newText,
                Link: wish[2],
                Description: wish[0],
                Image: wish[1]
            }
            this.deleteWish(wish);
            console.log("Wishmakers/" + this.wishmaker, this.newWish+"/Wishes/"+wishName)
            this.subscription =  this.service.setData(data, "Wishmakers/" + this.wishmaker, this.newWish+"/Wishes/"+wishName)
            .subscribe(res=>{})

            this.viewMode = false;

        }
    }

    showDescription(wish){
        this.currentDescription = wish[5];
        this.descriptionViewMode = !this.descriptionViewMode;
    }
    viewDescriptionField(wish){
       this.desTxtVM = !this.desTxtVM;
    }

    editDescription(newText, wish){
        if(this.desTxtVM == true){
            
            let data = {
                Reserved: wish[3],
                Reserver: this.guest,
                Wish: wish[5],
                Link: wish[2],
                Description: newText,
                Image: wish[1]
            }
            this.subscription = this.service.setData(data, "Wishmakers/" + this.wishmaker, this.newWish+"/Wishes/"+wish[5])
            .subscribe(res=>{})
        }
        
        this.viewDescriptionField(wish);
        //this.currentDescription = wish[4];
    }

    editLink(newLink, wish){
        this.linkViewMode = !this.linkViewMode;
    }

    storeImage(files: FileList){
        this.image = files.item(0);
        
        return this.image;
    }

    removeDots(wish){
        var wishName = "";

        for(var i = 0; i < wish.length; i++){
            if(wish.charAt(i) == "."){
               wishName += "|"
            }else{
              wishName += wish.charAt(i);
            }
        }

        return wishName;
    }

    showPreview(event: any) {
        this.selectedImage = event.target.files[0];
    }

    save() {
       
        if(this.selectedImage != null){
        var name = this.selectedImage.name;
        this.id = this.removeDots(name);
        const fileRef = this.storage.ref(name);
        this.storage.upload(name, this.selectedImage).snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              this.url = url;
              this.fileService.insertImageDetails(this.id, this.url);
              console.log("upload succesful")
            })
          })
        ).subscribe();
        }
    }

    view(file: string){

       this.fileService.getImage(file.substring(1, file.length));
    }

    ngOnDestroy(){
        this.subscription.unsubscribe();
    }

   
}
