import { Injectable } from '@angular/core';
import { ApiCallsService } from './api-calls.service';
import { Helper } from '../helpers/graph-helper';
@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private apiCalls: ApiCallsService, private helper: Helper) { }

  vertexClicked() {
    var vertextType;
    this.apiCalls.dataVariables.forEach((element, index) => {
      if (element.vertexId === this.helper.v1.id) {
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

  getVertexIndex() {
    var index1;
    this.apiCalls.dataVariables.forEach((element, index) => {
      if (element.vertexId === this.helper.v1.id) {
        index1 = index;
      }
    });
    return index1;
  }

  insertExternalRequest(externalRequest) {
    this.apiCalls.dataVariables.forEach((element, index) => {
      if (element.vertexId === this.helper.v1.id) {
        element.actions.push(externalRequest);
      }
    });
  }

  fetchExternalRequests() {
    var externalRequests;
    this.apiCalls.dataVariables.forEach((element, index) => {
      if (element.vertexId === this.helper.v1.id) {
        externalRequests = element.actions;
      }

    });
    return externalRequests;
  }

  setExternalRequest(externalRequest, i) {
    this.apiCalls.dataVariables.forEach((element, index) => {
      if (element.vertexId === this.helper.v1.id) {
        element.actions[i] = externalRequest;
      }
    });
  }
}
