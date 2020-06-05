import { AppError } from './app-error';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class DataService{
    constructor(private http: HttpClient){}

    getData(database, unit?){
        if(!unit){
            return this.http.get("https://wishlist-44e2c.firebaseio.com/"+database+".json") 
        }
        return this.http.get("https://wishlist-44e2c.firebaseio.com/"+database+"/"+unit+".json") 
    }

    insertData(data, database, unit?){
        return this.http.post("https://wishlist-44e2c.firebaseio.com/"+
        database+"/"+unit+".json",
        JSON.stringify(data))
        .pipe(map(data =>{
            return data;    
        }))
    }

    setData(data, database, unit?){
        return this.http.patch("https://wishlist-44e2c.firebaseio.com/" +
        database + "/" + unit +".json",
        JSON.stringify(data))
        .pipe(map(data =>{
            return data;
        }))
    }

    deleteData(database, unit){
        return this.http.delete("https://wishlist-44e2c.firebaseio.com/" +
        database + "/" + unit +".json");
    }
}