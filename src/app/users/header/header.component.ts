import { AuthService } from './../../services/auth.service';
import {Component, Input, OnInit} from "@angular/core";

@Component({
    selector: "header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.css"]
})

export class HeaderComponent implements OnInit{
  constructor(public auth: AuthService){}
  adminName;

  ngOnInit(){
  }

  admin(name){
    this.adminName = name;
  }
}