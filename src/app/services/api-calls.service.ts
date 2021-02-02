import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {
  flowId: any;
  retrievedJson: any;
  dataVariables: any = [];
  vertextType:any;
  constructor(private http: HttpClient) { }

  getData() {
    const httpOptions = this.getHttpOptions("asx");
    return this.http.get("http://209.58.160.20:3002/vertex/", httpOptions);
  }

  async retrieveGraph() {
    const httpOptions = this.getHttpOptions("asx");
    return await this.http.get("http://209.58.160.20:3002/mxgraph/" + this.flowId, httpOptions)
      .toPromise();

  }

  postNewFlowDefaultJson(json) {
    const httpOptions = this.getHttpOptions("asx");
    const body: any = json;
    console.log("flow id when posting: " + this.flowId)
    this.http.post<any>("http://209.58.160.20:3002/mxgraph/" + this.flowId, body, httpOptions).
      subscribe(data => {
        console.log("Starting json posted successfully");
      });

  }

  retrieveJson() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'asd'
      })
    };
    return this.http.get("http://209.58.160.20:3002/mxgraph/5ff56c587efe1d4649d6e191", httpOptions);
  }


  async getFlowId(title, description) {
    const httpOptions = this.getHttpOptions("asx");

    var body = {
      "botId": "",
      "description": description,
      "title": title,
      "topVertexId": ""

    }

    var data = await this.http.post<any>("http://209.58.160.20:3002/flow/", body, httpOptions).toPromise();

    this.flowId = data.data.id;

    this.dataVariables=[
      {
        "type": "TEXT_MESSAGE",
        "vertexId": "2",
        "buttons":[],
        "dataVariables": [
          {
            "id": 0,
            "dataVariable": "",
            "path": "",
            "optional": ""
          }
        ]
      },
      {
        "type": "TEXT_MESSAGE",
        "buttons":[],
        "vertexId": "3",
        "dataVariables": [
          {
            "id": 1,
            "dataVariable": "",
            "path": "",
            "optional": ""
          }
        ]
      }
    ]

    const json = {
       "dataVariable": this.dataVariables,
      "mxGraphModel": { "root":{"mxCell":[{"@id":"0"},{"@id":"1","@parent":"0"},{"@id":"4","@value":"","@edge":"1","@parent":"1","@source":"2","@target":"3","mxGeometry":{"@relative":"1","@as":"geometry"}}],"UserObject":[{"@id":"2","mxCell":{"@style":"rounded=1;whiteSpace=wrap;autosize=0;resizable=0;opacity=0","@vertex":"1","@parent":"1","mxGeometry":{"@x":"50","@width":"300","@height":"230","@as":"geometry"},"div":{"@xmlns":"http://www.w3.org/1999/xhtml","@as":"div","div":{"@id":"flow0","@class":"custom-card flow-start-container shadow-lg bg-white","@style":"border-radius: 33px; border-color: transparent;","div":[{"@class":"tooltip-parent"},{"@class":"card","@style":"border-radius:35px;border:0px;width:300px; min-height:200px;","svg":{"@xmlns":"http://www.w3.org/2000/svg","@height":"20","@width":"20","@class":"connect-icon","@style":"position: absolute;right: -12px; top:80%;z-index: 990;","circle":{"@cx":"10","@cy":"10","@r":"8","@stroke":"gray","@stroke-width":"2","@fill":"white"}},"div":[{"@id":"card-header0","@class":"card-header","@style":"background-color:white;border-radius:35px;border:0px;","img":{"@src":"../assets/play.png","@class":"start-icon float-left","@alt":"...","@style":"width:35px;height=35px"},"div":{"@style":"margin-left:60px;margin-top:5px;","h4":{"@id":"header0","@class":"header","#text":"Starting Step"}}},{"@id":"card-body0","@class":"card-body flow-start-trigger-list","@style":"height:63px","span":{"@id":"initial-message0","@class":"initial-message","@style":"font-size: 1.1rem; position: absolute;left: 10px;right: 10px;top: 65px;font-weight: 500","#text":" Flow starts with the following step. Click to add the triggers. "}}]}],"span":{"@class":"tooltip-text","div":{"@class":"d-inline img-icon mr-2","img":{"@class":"delete","@src":"../assets/delete.png"}},"img":{"@class":"copy","@src":"../assets/copy.png"}}},"br":null}}},{"@id":"3","mxCell":{"@style":"rounded=1;whiteSpace=wrap;autosize=0;resizable=0;opacity=0","@vertex":"1","@parent":"1","mxGeometry":{"@x":"500","@y":"200","@width":"300","@height":"230","@as":"geometry"},"div":{"@xmlns":"http://www.w3.org/1999/xhtml","@as":"div","div":{"@id":"flow1","@class":"custom-card flow-start-container shadow-lg bg-white","@style":"border-radius: 33px; border-color: transparent;","div":[{"@class":"tooltip-parent"},{"@class":"card","@style":"border-radius:35px;border:0px;width:300px; min-height:200px;","svg":{"@xmlns":"http://www.w3.org/2000/svg","@height":"20","@width":"20","@class":"connect-icon","@style":"position: absolute;right: -12px; top:80%;z-index: 990;","circle":{"@cx":"10","@cy":"10","@r":"8","@stroke":"gray","@stroke-width":"2","@fill":"white"}},"div":[{"@id":"card-header1","@class":"card-header","@style":"background-color:white;border-radius:35px;border:0px;","img":{"@src":"../assets/messenger.svg","@class":"start-icon float-left","@alt":"...","@style":"width:35px;height=35px"},"div":{"@style":"margin-left:60px;margin-top:5px;","h4":{"@id":"header1","@class":"header","#text":"Message #1"}}},{"@id":"card-body1","@class":"card-body flow-start-trigger-list","@style":"height:63px","span":{"@id":"initial-message1","@class":"initial-message","@style":"font-size: 1.1rem; position: absolute;left: 10px;right: 10px;top: 65px;font-weight: 500","#text":" Flow starts with the following step. Click to add the triggers. "}}]}],"span":{"@class":"tooltip-text","div":{"@class":"d-inline img-icon mr-2","img":{"@class":"delete","@src":"../assets/delete.png"}},"img":{"@class":"copy","@src":"../assets/copy.png"}}},"br":null}}}]}}
   };

    this.postNewFlowDefaultJson(json);

  }
  retrieveFlowId() {
    return this.flowId;
  }

  getHttpOptions(authorization) {
    return {
      headers: new HttpHeaders({
        Authorization: authorization
      })
    };
  }


  async autoSaveAdd(object,type) { 
    const httpOptions = this.getHttpOptions("asx");
    object=JSON.parse(object);
    var body = { "dataVariable": this.dataVariables, object };
    if (this.flowId) {
      console.log("Updating after addition")
      return await this.http.patch<any>("http://209.58.160.20:3002/mxgraph/ADD/" + this.flowId, body, httpOptions).toPromise
        ();
    }
  }


  autoSaveDelete(object) {

    const httpOptions = this.getHttpOptions("asx");
    object = JSON.parse(object)
    var body = {object};
    if (this.flowId) {
      this.http.patch<any>("http://209.58.160.20:3002/mxgraph/DELETE/" + this.flowId, body, httpOptions).toPromise
        ().then((data) => {
          console.log("Flow updated after deletion!")
        });
    }
  }


  autoSaveUpdate(object) {
    const httpOptions = this.getHttpOptions("asx");
    object=JSON.parse(object);
    var body = { "dataVariable": this.dataVariables, object };
    console.log(body)
    if (this.flowId) {
      this.http.patch<any>("http://209.58.160.20:3002/mxgraph/UPDATE/" + this.flowId, body, httpOptions).toPromise
        ().then((data) => {
          console.log("Flow Updated after change!")
        });
    }
  }

  publishmxGraph() {

    const httpOptions = this.getHttpOptions("asx")
    const body = {

    }

    if (this.flowId) {
      this.http.patch<any>("http://209.58.160.20:3002/mxgraph/publish/" + this.flowId, body, httpOptions).toPromise
        ().then((data) => {
          console.log("Flow Pusblished!")
        });
    }
  }

}
