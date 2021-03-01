import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {
  flowId: any;
  retrievedJson: any;
  data: any = [];
  vertextType: any;
  pathVariable: string = "http://209.58.160.20:3002";
  constructor(private http: HttpClient, private router: Router) { }


  async getAllflows() {
    const httpOptions = this.getHttpOptions("asx");
    return await this.http.get(this.pathVariable + "/flow/getall/" + localStorage.getItem("ownerId"), httpOptions).toPromise();
  }

  async retrieveGraph() {
    const httpOptions = this.getHttpOptions("asx");
    return await this.http.get(this.pathVariable + "/mxgraph/" + this.flowId, httpOptions)
      .toPromise();
  }

  postNewFlowDefaultJson(json) {
    const httpOptions = this.getHttpOptions("asx");
    const body: any = json;
    console.log("flow id when posting: " + this.flowId)
    try {
      this.http.post<any>(this.pathVariable + "/mxgraph/" + this.flowId, body, httpOptions).
        subscribe(data => {
          console.log("Starting json posted successfully");
        });
    } catch (ex) {
      if (ex.status == "401") {
        this.status401();
      }
      else if (ex.status == "403") {
        this.status403();
      }
    }

  }


  async getFlowId(title, description) {
    const httpOptions = this.getHttpOptions("asx");

    var body = {
      "botId": "",
      "description": description,
      "title": title,
      "topVertexId": "",
      "ownerId": localStorage.getItem("ownerId")

    }
    try {
      var data = await this.http.post<any>(this.pathVariable + "/flow/", body, httpOptions).toPromise();
    } catch (ex) {
      if (ex.status == "401") {
        this.status401();
      }
      else if (ex.status == "403") {
        this.status403();
      }
    }
    this.flowId = data.data.id;

    this.data = [
      {
        "type": "TEXT_MESSAGE",
        "vertexId": "2",
        "buttons": [],
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
        "buttons": [],
        "vertexId": "5",
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
      "data": this.data,
      "mxGraphModel": { "root": { "mxCell": [{ "@id": "0" }, { "@id": "1", "@parent": "0" }, { "@id": "8", "@value": "", "@edge": "1", "@parent": "1", "@source": "2", "@target": "5", "mxGeometry": { "@relative": "1", "@as": "geometry" } }], "UserObject": [{ "@id": "2", "mxCell": { "@style": "rounded=1;whiteSpace=wrap;autosize=0;resizable=0;opacity=0", "@vertex": "1", "@connectable": "0", "@parent": "1", "mxGeometry": { "@x": "50", "@width": "300", "@height": "200", "@as": "geometry" }, "div": { "@xmlns": "http://www.w3.org/1999/xhtml", "@as": "div", "div": { "@id": "flow0", "@class": "custom-card flow-start-container shadow-lg bg-white", "@style": "border-radius: 33px; border-color: transparent;", "div": [{ "@class": "tooltip-parent" }, { "@class": "card", "@style": "border-radius:35px;border:0px;width:300px; min-height:200px;", "div": [{ "@id": "card-header0", "@class": "card-header", "@style": "background-color:white;border-radius:35px;border:0px;", "img": { "@src": "assets/play.png", "@class": "start-icon float-left", "@alt": "...", "@style": "width:35px;height=35px" }, "div": { "@style": "margin-left:60px;margin-top:5px;", "h4": { "@id": "header0", "@class": "header", "#text": "Starting Step" } } }, { "@id": "card-body0", "@class": "card-body flow-start-trigger-list", "@style": "height:63px", "span": { "@id": "initial-message0", "@class": "initial-message", "@style": "font-size: 1.1rem; position: absolute;left: 10px;right: 10px;top: 65px;font-weight: 500", "#text": " Flow starts with the following step. Click to add the triggers. " } }] }], "span": { "@class": "tooltip-text", "div": { "@class": "d-inline img-icon mr-2", "img": { "@class": "delete", "@src": "assets/delete.png" } }, "img": { "@class": "copy", "@src": "assets/copy.png" } } }, "br": null } } }, { "@id": "5", "mxCell": { "@style": "rounded=1;whiteSpace=wrap;autosize=0;resizable=0;opacity=0", "@vertex": "1", "@connectable": "0", "@parent": "1", "mxGeometry": { "@x": "500", "@y": "200", "@width": "300", "@height": "200", "@as": "geometry" }, "div": { "@xmlns": "http://www.w3.org/1999/xhtml", "@as": "div", "div": { "@id": "flow1", "@class": "custom-card flow-start-container shadow-lg bg-white", "@style": "border-radius: 33px; border-color: transparent;", "div": [{ "@class": "tooltip-parent" }, { "@class": "card", "@style": "border-radius:35px;border:0px;width:300px; min-height:200px;", "div": [{ "@id": "card-header1", "@class": "card-header", "@style": "background-color:white;border-radius:35px;border:0px;", "img": { "@src": "assets/messenger.svg", "@class": "start-icon float-left", "@alt": "...", "@style": "width:35px;height=35px" }, "div": { "@style": "margin-left:60px;margin-top:5px;", "h4": { "@id": "header1", "@class": "header", "#text": "Message #1" } } }, { "@id": "card-body1", "@class": "card-body flow-start-trigger-list", "@style": "height:63px", "span": { "@id": "initial-message1", "@class": "initial-message", "@style": "font-size: 1.1rem; position: absolute;left: 10px;right: 10px;top: 65px;font-weight: 500", "#text": " Flow starts with the following step. Click to add the triggers. " } }] }], "span": { "@class": "tooltip-text", "div": { "@class": "d-inline img-icon mr-2", "img": { "@class": "delete", "@src": "assets/delete.png" } }, "img": { "@class": "copy", "@src": "assets/copy.png" } } }, "br": null } } }], "ConnectionStart": [{ "@id": "3", "mxCell": { "@style": "resizable=0;constituent=1;movable=0;strokeColor=none;opacity=0;", "@vertex": "1", "@parent": "2", "mxGeometry": { "@x": "1", "@y": "1", "@width": "15", "@height": "15", "@relative": "1", "@as": "geometry", "mxPoint": { "@x": "-7", "@y": "-45", "@as": "offset" } }, "div": { "@xmlns": "http://www.w3.org/1999/xhtml", "@as": "div", "svg": { "@xmlns": "http://www.w3.org/2000/svg", "@height": "20", "@width": "20", "@class": "connect-icon", "circle": { "@cx": "10", "@cy": "10", "@r": "8", "@stroke": "gray", "@stroke-width": "2", "@fill": "white" } }, "br": null } } }, { "@id": "6", "mxCell": { "@style": "resizable=0;constituent=1;movable=0;strokeColor=none;opacity=0;", "@vertex": "1", "@parent": "5", "mxGeometry": { "@x": "1", "@y": "1", "@width": "15", "@height": "15", "@relative": "1", "@as": "geometry", "mxPoint": { "@x": "-7", "@y": "-45", "@as": "offset" } }, "div": { "@xmlns": "http://www.w3.org/1999/xhtml", "@as": "div", "svg": { "@xmlns": "http://www.w3.org/2000/svg", "@height": "20", "@width": "20", "@class": "connect-icon", "circle": { "@cx": "10", "@cy": "10", "@r": "8", "@stroke": "gray", "@stroke-width": "2", "@fill": "white" } }, "br": null } } }], "ConnectionEnd": [{ "@id": "4", "mxCell": { "@style": "resizable=0;constituent=1;movable=0;strokeColor=none;opacity=0;", "@vertex": "1", "@parent": "2", "mxGeometry": { "@width": "20", "@height": "20", "@relative": "1", "@as": "geometry", "mxPoint": { "@y": "45", "@as": "offset" } }, "div": { "@xmlns": "http://www.w3.org/1999/xhtml", "@as": "div", "svg": { "@xmlns": "http://www.w3.org/2000/svg", "@height": "20", "@width": "20", "circle": { "@cx": "10", "@cy": "10", "@r": "8", "@stroke": "white", "@stroke-width": "2", "@fill": "white" } }, "br": null } } }, { "@id": "7", "mxCell": { "@style": "resizable=0;constituent=1;movable=0;strokeColor=none;opacity=0;", "@vertex": "1", "@parent": "5", "mxGeometry": { "@width": "20", "@height": "20", "@relative": "1", "@as": "geometry", "mxPoint": { "@y": "45", "@as": "offset" } }, "div": { "@xmlns": "http://www.w3.org/1999/xhtml", "@as": "div", "svg": { "@xmlns": "http://www.w3.org/2000/svg", "@height": "20", "@width": "20", "circle": { "@cx": "10", "@cy": "10", "@r": "8", "@stroke": "white", "@stroke-width": "2", "@fill": "white" } }, "br": null } } }] } }

    };
    this.postNewFlowDefaultJson(json);

  }

  getHttpOptions(authorization) {
    return {
      headers: new HttpHeaders({
        Authorization: authorization
      }),
      params: {
        "userId": localStorage.getItem("ownerId")
      }
    };
  }


  async autoSaveAdd(object, type) {

    const httpOptions = this.getHttpOptions("asx");
    object = JSON.parse(object);
    var body = { "data": this.data, object };

    if (this.flowId) {
      console.log("Updating after addition")
      try {
        return await this.http.patch<any>(this.pathVariable + "/mxgraph/ADD/" + this.flowId, body, httpOptions).toPromise
          ();
      } catch (ex) {
        if (ex.status == "401") {
          this.status401();
        }
        else if (ex.status == "403") {
          this.status403();
        }
      }
    }
  }


  autoSaveDelete(object) {

    const httpOptions = this.getHttpOptions("asx");
    object = JSON.parse(object)
    var body = { object };
    if (this.flowId) {

      try {
        this.http.patch<any>(this.pathVariable + "/mxgraph/DELETE/" + this.flowId, body, httpOptions).toPromise
          ().then((data) => {
            console.log("Flow updated after deletion!")
          });
      } catch (ex) {
        if (ex.status == "401") {
          this.status401();
        }
        else if (ex.status == "403") {
          this.status403();
        }
      }
    }
  }


  autoSaveUpdate(object) {
    const httpOptions = this.getHttpOptions("asx");
    object = JSON.parse(object);
    var body = { "data": this.data, object };
    if (this.flowId) {
      try {
        this.http.patch<any>(this.pathVariable + "/mxgraph/UPDATE/" + this.flowId, body, httpOptions).toPromise
          ().then((data) => {
            console.log("Flow Updated after change!")
          });
      } catch (ex) {
        if (ex.status == "401") {
          this.status401();
        }
        else if (ex.status == "403") {
          this.status403();
        }
      }
    }
  }

  publishmxGraph() {

    const httpOptions = this.getHttpOptions("asx")
    const body = {

    }

    if (this.flowId) {
      try {
        this.http.patch<any>(this.pathVariable + "/mxgraph/publish/" + this.flowId, body, httpOptions).toPromise
          ().then((data) => {
            console.log("Flow Pusblished!")
          });
      } catch (ex) {
        if (ex.status == "401") {
          this.status401();
        }
        else if (ex.status == "403") {
          this.status403();
        }
      }
    }
  }


  registerClient(signUpData) {
    this.http.post<any>("http://209.58.160.20:20921/clients/register", signUpData, this.getHttpOptions("asx")).
      subscribe(data => {
        console.log(data);
      });
  }
  authenticateClient(logInData) {


    return this.http.post<any>("http://209.58.160.20:20921/clients/authenticate", logInData, this.getHttpOptions("asx")).
      subscribe(data => {
        localStorage.setItem('accessToken', data.data.session.accessToken)
        localStorage.setItem('ownerId', data.data.session.ownerId)
        if (data.status == 202) {
          this.router.navigate(["/flows"]);
        }
      }, error => alert(error.status));
  }

  async getUserChannels() {
    const httpOptions = this.getHttpOptions("asx");
    return await this.http.get("http://209.58.160.20:20921"+ "/userChannels", httpOptions).toPromise();
  }

  status401() {
    this.router.navigateByUrl('/signin');
  }

  status403() {
    alert("You are not authorized to access such resource")
    this.router.navigateByUrl('/');
  }
}
