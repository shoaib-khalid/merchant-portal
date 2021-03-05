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
    try {
      this.apiCalls.data.forEach((element, index) => {

        if (element.vertexId === this.helper.v1.id) {
          vertextType = element.type;
        }


      });
    } catch (ex) {
      return "";
    }
    return vertextType;
  }

  getLastId() {
    var lastId;
    const length = this.apiCalls.data.length;
    if (length > 0) {
      lastId = parseInt(this.apiCalls.data[length - 1].dataVariables[0].id);
    } else {
      lastId = -1;
    }
    return lastId + 1;
  }

  getVertexIndex() {
    var index1;
    this.apiCalls.data.forEach((element, index) => {
      try {
        if (element.vertexId === this.helper.v1.id) {
          index1 = index;
        }
      } catch (ex) {
        return null;
      }
    });
    return index1;
  }

  insertExternalRequest(externalRequest) {
    this.apiCalls.data.forEach((element, index) => {
      if (element.vertexId === this.helper.v1.id) {
        element.actions.push(externalRequest);
      }
    });
  }

  fetchExternalRequests() {
    var externalRequests;
    this.apiCalls.data.forEach((element, index) => {
      if (element.vertexId === this.helper.v1.id) {
        externalRequests = element.actions;
      }

    });
    return externalRequests;
  }

  setExternalRequest(externalRequest, i) {
    this.apiCalls.data.forEach((element, index) => {
      if (element.vertexId === this.helper.v1.id) {
        element.actions[i] = externalRequest;
      }
    });
  }

  getAllDataVariables() {
    var dataVariableNames = [];
    console.log(this.apiCalls.data)
    this.apiCalls.data.forEach(element => {

      if (element.type === "ACTION") {
        for (var j = 0; j < element.actions.length; j++) {
          for (var k = 0; k < element.actions[j].externalRequest.response.mapping.length; k++) {
            if (element.actions[j].externalRequest.response.mapping[k].dataVariable) {
              dataVariableNames.push(element.actions[j].externalRequest.response.mapping[k].dataVariable)
            }
          }
        }
      } else {
        for (var i = 0; i < element.dataVariables.length; i++) {
          const dataVariableName = element.dataVariables[i].dataVariable;
          if (dataVariableName) {
            dataVariableNames.push(dataVariableName)
          }
        }
      }
    });
    return dataVariableNames;
  }
}
