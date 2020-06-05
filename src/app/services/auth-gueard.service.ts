import { AuthService } from './auth.service';
import {Injectable} from "@angular/core";
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate{

    constructor(
        private router: Router,
        private authService: AuthService){}
    
    canActivate(){
        if(this.authService.adminLoggedIn()) return true

        this.router.navigate(["/guest"])
        return false;
    }


}

@Injectable()
export class GuestGuard implements CanActivate{

    constructor(
        private router: Router,
        private authService: AuthService){}
    
    canActivate(){
        console.log("guest canactivate")
        if(this.authService.guestLoggedIn()) return true

        this.router.navigate(["/guest"])
        return false;
    }


}

@Injectable()
export class UserGuard implements CanActivate{

    constructor(
        private router: Router,
        private authService: AuthService){}
    
    canActivate(){
        if(this.authService.isLoggedIn()) return true

        this.router.navigate(["/guest"])
        return false;
    }


}

@Injectable()
export class AccessGuard implements CanActivate{

    access: boolean;
    guest: String;
    wishmaker: String; 

    constructor(
        private router: Router,
        private authService: AuthService){}
    
    canActivate(){
        if(this.authService.noAccess(this.access)) return true

        this.router.navigate(["/guest"])
        return false;
    }

    setAccess(access){
        this.access = access;
        //this.guest = guest;
        //this.wishmaker = wishmaker;
    }


}