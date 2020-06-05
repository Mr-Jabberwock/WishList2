import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class RoutingService{
   constructor(private http: HttpClient, public route: ActivatedRoute){}

   getParams(database: string){
    return "Alexander";
    }


   
}