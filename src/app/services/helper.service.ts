import { Injectable } from '@angular/core';
import { ApiCallsService } from './api-calls.service';
import { Helper } from '../helpers/graph-helper';
@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private apiCalls: ApiCallsService) { }

  vertexClicked() {
    var vertextType;
    this.apiCalls.dataVariables.forEach((element, index) => {
      if (element.vertexId === Helper.v1.id) {
        vertextType = element.type;
      }
    });
    return vertextType;
  }

  getLastId() {
    var lastId;
    const length = this.apiCalls.dataVariables.length;
    if (length > 0) {
      lastId = parseInt(this.apiCalls.dataVariables[length - 1].dataVariables[0].id);
    } else {
      lastId = -1;
    }
    return lastId + 1;
  }
}
