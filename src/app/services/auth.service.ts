import { Router } from  "@angular/router";
import { auth } from  'firebase/app';
import { AngularFireAuth } from  "@angular/fire/auth";
import { User } from  'firebase';

import { Injectable } from  '@angular/core';

@Injectable()

export  class  AuthService {
    //User login 
    login(name){
        localStorage.setItem("token", name);
    }

    isLoggedIn(){
        return localStorage.getItem("token") != null;
    }

    //Admin login
    admin(name){
        localStorage.setItem("admin", name);
    }

    adminLoggedIn(){
        return localStorage.getItem("admin") != null;
    }

    //Wishmaker login
    guestLogin(name){
        return localStorage.setItem("guest", name);
    }

    guestLoggedIn(){
        return localStorage.getItem("guest") != null;
    }

    noAccess(noAccess){
        return noAccess; 
    }

    logOut(){
        localStorage.removeItem("guest")
        localStorage.removeItem("admin");
        localStorage.removeItem("token");
    }

}