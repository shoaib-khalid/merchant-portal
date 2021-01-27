import { Injectable } from '@angular/core';
import {ApiCallsService} from './api-calls.service';
import {Helper} from '../helpers/graph-helper';
@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private apiCalls:ApiCallsService) { }

  vertexClicked(){

    var vertextType;
    this.apiCalls.dataVariables.forEach((element, index) => {
        if (element.vertexId == Helper.v1.id) {

           vertextType=element.type;
        }
     });

     return vertextType;
    }
}
