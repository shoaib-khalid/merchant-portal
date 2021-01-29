import { Injectable } from '@angular/core';
import { ApiCallsService } from './api-calls.service';
import { Helper } from '../helpers/graph-helper';
@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private apiCalls: ApiCallsService) { }

  vertexClicked() {
console.log(this.apiCalls.dataVariables)
    var vertextType;
    this.apiCalls.dataVariables.forEach((element, index) => {
      console.log({"vertexId":element.vertexId,"Helper.v1.Id":Helper.v1.id})
      if (element.vertexId === Helper.v1.id) {
        console.log("INSIDE")
        vertextType = element.type;
      }
    });
    return vertextType;
  }

  getLastId() {
    var lastId
    if (length > 0) {
      lastId = parseInt(this.apiCalls.dataVariables[length - 1].dataVariables[0].id);
    } else {
      lastId = -1;
    }
    return lastId + 1;
  }
}
