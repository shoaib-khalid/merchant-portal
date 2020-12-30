import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private http:HttpClient) { }

  getData(){
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'asx'
      })
    };
    return this.http.get("http://209.58.160.20:3002/vertex/",httpOptions);
  }
 
}
