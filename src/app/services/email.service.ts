import {Injectable} from "@angular/core";
import {HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

//var nodemailer = require("nodemailer");
@Injectable()
export class EmailService{

  constructor(private http: HttpClient) {}
 
  sendmail(email, wishlist, wishmaker){
    const Email = {
      email: email,
      wishlist: wishlist,
      wishmaker: wishmaker
    }
    return this.http.post("http://localhost:3000/sendmail", Email);
  } 

  sendWelcomMessage(email, wishmaker, password){
    const Email = {
      email: email,
      wishmaker: wishmaker,
      password: password
    }

    return this.http.post("http://localhost:3000/welcome", Email)
  }
}