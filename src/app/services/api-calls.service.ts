import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {
  flowId: any;
  retrievedJson: any;
  data: any = [];
  vertextType: any;
  pathVariable1: string = environment.url1;
  pathVariable2: string = environment.url2;
  pathVariable3: string = environment.url3;

  constructor(private http: HttpClient, private router: Router) { }


  async getAllflows() {
    const httpOptions = this.getHttpOptions("asx");
    return await this.http.get(this.pathVariable1 + "/flow/getall/" + localStorage.getItem("ownerId"), httpOptions).toPromise();
  }

  async retrieveGraph() {
    const httpOptions = this.getHttpOptions("asx");
    return await this.http.get(this.pathVariable1 + "/mxgraph/" + this.flowId, httpOptions)
      .toPromise();
  }

  postNewFlowDefaultJson(json) {
    const httpOptions = this.getHttpOptions("asx");
    const body: any = json;
    console.log("flow id when posting: " + this.flowId)
    try {
      this.http.post<any>(this.pathVariable1 + "/mxgraph/" + this.flowId, body, httpOptions).
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
      var data = await this.http.post<any>(this.pathVariable1 + "/flow/", body, httpOptions).toPromise();
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
      "mxGraphModel": { "root": { "mxCell": [{ "@id": "0" }, { "@id": "1", "@parent": "0" }, { "@id": "8", "@edge": "1", "@parent": "1", "@source": "3", "@target": "7", "mxGeometry": { "@relative": "1", "@as": "geometry" } }], "UserObject": [{ "@id": "2", "mxCell": { "@style": "rounded=1;whiteSpace=wrap;autosize=0;resizable=0;opacity=0", "@vertex": "1", "@connectable": "0", "@parent": "1", "mxGeometry": { "@x": "50", "@width": "300", "@height": "200", "@as": "geometry" }, "div": { "@xmlns": "http://www.w3.org/1999/xhtml", "@as": "div", "div": { "@id": "flow0", "@class": "custom-card flow-start-container shadow-lg bg-white", "@style": "border-radius: 33px; border-color: transparent;", "div": [{ "@class": "tooltip-parent" }, { "@class": "card", "@style": "border-radius:35px;border:0px;width:300px; min-height:200px;", "div": [{ "@id": "card-header0", "@class": "card-header", "@style": "background-color:white;border-radius:35px;border:0px;", "img": { "@src": "assets/play.png", "@class": "start-icon float-left", "@alt": "...", "@style": "width:35px;height=35px" }, "div": { "@style": "margin-left:60px;margin-top:5px;", "h4": { "@id": "header0", "@class": "header", "#text": "Starting Step" } } }, { "@id": "card-body0", "@class": "card-body flow-start-trigger-list", "@style": "height:63px", "span": { "@id": "initial-message0", "@class": "initial-message", "@style": "font-size: 1.1rem; position: absolute;left: 10px;right: 10px;top: 65px;font-weight: 500", "#text": " Flow starts with the following step. Click to add the triggers. " } }] }], "span": { "@class": "tooltip-text", "div": { "@class": "d-inline img-icon mr-2", "img": { "@class": "delete", "@src": "assets/delete.png" } }, "img": { "@class": "copy", "@src": "assets/copy.png" } } }, "br": null } } }, { "@id": "5", "mxCell": { "@style": "rounded=1;whiteSpace=wrap;autosize=0;resizable=0;opacity=0", "@vertex": "1", "@connectable": "0", "@parent": "1", "mxGeometry": { "@x": "480", "@y": "120", "@width": "300", "@height": "200", "@as": "geometry" }, "div": { "@xmlns": "http://www.w3.org/1999/xhtml", "@as": "div", "div": { "@id": "flow1", "@class": "custom-card flow-start-container shadow-lg bg-white", "@style": "border-radius: 33px; border-color: transparent;", "div": [{ "@class": "tooltip-parent" }, { "@class": "card", "@style": "border-radius:35px;border:0px;width:300px; min-height:200px;", "div": [{ "@id": "card-header1", "@class": "card-header", "@style": "background-color:white;border-radius:35px;border:0px;", "img": { "@src": "assets/messenger.svg", "@class": "start-icon float-left", "@alt": "...", "@style": "width:35px;height=35px" }, "div": { "@style": "margin-left:60px;margin-top:5px;", "h4": { "@id": "header1", "@class": "header", "#text": "Message #1" } } }, { "@id": "card-body1", "@class": "card-body flow-start-trigger-list", "@style": "height:63px", "span": { "@id": "initial-message1", "@class": "initial-message", "@style": "font-size: 1.1rem; position: absolute;left: 10px;right: 10px;top: 65px;font-weight: 500", "#text": " Flow starts with the following step. Click to add the triggers. " } }] }], "span": { "@class": "tooltip-text", "div": { "@class": "d-inline img-icon mr-2", "img": { "@class": "delete", "@src": "assets/delete.png" } }, "img": { "@class": "copy", "@src": "assets/copy.png" } } }, "br": null } } }], "ConnectionStart": [{ "@id": "3", "mxCell": { "@style": "resizable=0;constituent=1;movable=0;strokeColor=none;opacity=0;port=1;", "@vertex": "1", "@parent": "2", "mxGeometry": { "@x": "1", "@y": "1", "@width": "15", "@height": "15", "@relative": "1", "@as": "geometry", "mxPoint": { "@x": "-7", "@y": "-45", "@as": "offset" } }, "div": { "@xmlns": "http://www.w3.org/1999/xhtml", "@as": "div", "svg": { "@xmlns": "http://www.w3.org/2000/svg", "@height": "20", "@width": "20", "@class": "connect-icon", "circle": { "@cx": "10", "@cy": "10", "@r": "8", "@stroke": "gray", "@stroke-width": "2", "@fill": "gray" } }, "br": null } } }, { "@id": "6", "mxCell": { "@style": "resizable=0;constituent=1;movable=0;strokeColor=none;opacity=0;port=1;", "@vertex": "1", "@parent": "5", "mxGeometry": { "@x": "1", "@y": "1", "@width": "15", "@height": "15", "@relative": "1", "@as": "geometry", "mxPoint": { "@x": "-7", "@y": "-45", "@as": "offset" } }, "div": { "@xmlns": "http://www.w3.org/1999/xhtml", "@as": "div", "svg": { "@xmlns": "http://www.w3.org/2000/svg", "@height": "20", "@width": "20", "@class": "connect-icon", "circle": { "@cx": "10", "@cy": "10", "@r": "8", "@stroke": "gray", "@stroke-width": "2", "@fill": "white" } }, "br": null } } }], "ConnectionEnd": [{ "@id": "4", "mxCell": { "@style": "resizable=0;constituent=1;movable=0;strokeColor=none;opacity=0;port=1;", "@vertex": "1", "@parent": "2", "mxGeometry": { "@width": "20", "@height": "20", "@relative": "1", "@as": "geometry", "mxPoint": { "@y": "45", "@as": "offset" } }, "div": { "@xmlns": "http://www.w3.org/1999/xhtml", "@as": "div", "svg": { "@xmlns": "http://www.w3.org/2000/svg", "@height": "20", "@width": "20", "circle": { "@cx": "10", "@cy": "10", "@r": "8", "@stroke": "white", "@stroke-width": "2", "@fill": "white" } }, "br": null } } }, { "@id": "7", "mxCell": { "@style": "resizable=0;constituent=1;movable=0;strokeColor=none;opacity=0;port=1;", "@vertex": "1", "@parent": "5", "mxGeometry": { "@width": "20", "@height": "20", "@relative": "1", "@as": "geometry", "mxPoint": { "@y": "45", "@as": "offset" } }, "div": { "@xmlns": "http://www.w3.org/1999/xhtml", "@as": "div", "svg": { "@xmlns": "http://www.w3.org/2000/svg", "@height": "20", "@width": "20", "circle": { "@cx": "10", "@cy": "10", "@r": "8", "@stroke": "white", "@stroke-width": "2", "@fill": "white" } }, "br": null } } }] } }
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
        return await this.http.patch<any>(this.pathVariable1 + "/mxgraph/ADD/" + this.flowId, body, httpOptions).toPromise
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
        this.http.patch<any>(this.pathVariable1 + "/mxgraph/DELETE/" + this.flowId, body, httpOptions).toPromise
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
        this.http.patch<any>(this.pathVariable1 + "/mxgraph/UPDATE/" + this.flowId, body, httpOptions).toPromise
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

  publishmxGraph(botIds, flowId = this.flowId) {
    this.flowId = flowId;
    const httpOptions = this.getHttpOptions("asx")
    const body = {
      "botIds": botIds
    }

    if (this.flowId) {
      try {
        this.http.patch<any>(this.pathVariable1 + "/mxgraph/publish/" + this.flowId, body, httpOptions).toPromise
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

  async getPublishedBots() {

    const httpOptions = {

      headers: new HttpHeaders({
        Authorization: "asx"
      })
    }
    console.log(this.flowId)
    var data: any = await this.http.get(this.pathVariable1 + "/mxgraph/publish/" + this.flowId, httpOptions).toPromise();
    console.log(data)
  }


  registerClient(signUpData) {
    const httpOptions = {

      headers: new HttpHeaders({
        Authorization: "asx"
      })
    }
    this.http.post<any>(this.pathVariable2 + "/clients/register", signUpData, httpOptions).
      subscribe(data => {
        this.authenticateClient({ username: signUpData.username, password: signUpData.password })
      }, error => {
        if (error.status == "409") {
          alert("User already exists")
        }
      });

  }
  authenticateClient(logInData) {

    return this.http.post<any>(this.pathVariable2 + "/clients/authenticate", logInData, this.getHttpOptions("asx")).
      subscribe(async data => {
        if (data.status == 202) {
          localStorage.setItem('accessToken', data.data.session.accessToken)
          localStorage.setItem('ownerId', data.data.session.ownerId)
          localStorage.setItem('username', data.data.session.username)

          const httpOptions = {
            params: {
              clientId: localStorage.getItem("ownerId")
            }
          }

          var data: any = await this.http.get(this.pathVariable3 + "/stores", httpOptions).toPromise();
          if (data.data.content.length == 0) {
            this.router.navigateByUrl('/chooseverticle')
          } else if (data.data.content.length == 1) {
            localStorage.setItem("storeId", data.data.content[0].id)
            this.router.navigateByUrl('/products/add')
          } else {
            this.router.navigateByUrl('/store-management')

          }
        }
      }, error => console.log(error));
  }

  getStoresByOwnerId() {

    const httpOptions = {
      params: {
        clientId: localStorage.getItem("ownerId")
      }
    }

    return this.http.get(this.pathVariable3 + "/stores", httpOptions).toPromise();
  }

  async getUserChannels() {
    const httpOptions = this.getHttpOptions("asx");
    return await this.http.get(this.pathVariable2 + "/userChannels", httpOptions).toPromise();
  }

  updateFlowDetails(body) {
    const httpOptions = {

      headers: new HttpHeaders({
        Authorization: "asx"
      })
    }
    this.http.patch<any>(this.pathVariable1 + "/flow/" + this.flowId, body, httpOptions).toPromise
      ().then((data) => {
        console.log("Flow Details Updated")
      });
  }

  async retrieveFlowDetails(id) {
    const httpOptions = {

      headers: new HttpHeaders({
        Authorization: "asx"
      })
    }
    return await this.http.get(this.pathVariable1 + "/flow/" + id, httpOptions).toPromise();
  }


  registerStore(body) {
    const httpOptions = {

      headers: new HttpHeaders({
        Authorization: "asx"
      })
    }
    this.http.post<any>(this.pathVariable3 + "/stores", body, httpOptions).
      subscribe(data => {
        localStorage.setItem("storeId", data.data.id)
        this.router.navigateByUrl('/flows');

      });
  }

  deleteFlow(id) {
    this.http.delete(this.pathVariable1 + "/flow/" + id)
      .subscribe((data) => console.log(data));
  }


  addProduct(body) {
    const httpOptions = {

      headers: new HttpHeaders({
        Authorization: "asx"
      })
    }
    return this.http.post<any>(this.pathVariable3 + "/stores/" + localStorage.getItem("storeId") + "/" + "products", body, httpOptions).toPromise();
  }


  getProducts(page = 0) {
    const httpOptions = {

      headers: new HttpHeaders({
        Authorization: "asx"
      }),
      params: {
        "pageSize": "15",
        "page": page + ""

      }
    }
    return this.http.get("http://209.58.160.20:7071/stores/" + localStorage.getItem("storeId") + "/products", httpOptions).toPromise();

  }


  addVariant(productId, body) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "asx"
      })
    }

    return this.http.post<any>(this.pathVariable3 + "/stores/" + localStorage.getItem("storeId") + "/products/" + productId + "/" + "variants", body, httpOptions).
      toPromise();
  }

  addVariantValues(productId, body) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "asx"
      })
    }

    return this.http.post<any>(this.pathVariable3 + "/stores/" + localStorage.getItem("storeId") + "/products/" + productId + "/" + "variants-available", body, httpOptions).
      toPromise();
  }

  addInventory(productId, body) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "asx"
      })
    }

    return this.http.post<any>(this.pathVariable3 + "/stores/" + localStorage.getItem("storeId") + "/products/" + productId + "/" + "inventory", body, httpOptions).
      toPromise();
  }


  addInventoryItem(productId, body) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "asx"
      })
    }

    return this.http.post<any>(this.pathVariable3 + "/stores/" + localStorage.getItem("storeId") + "/products/" + productId + "/" + "inventory-item", body, httpOptions).
      toPromise();
  }

  async getOrders() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "asx"
      }),

      params: {
        "storeId": localStorage.getItem("storeId")
      }
    }
    return await this.http.get("http://209.58.160.20:7072/orders", httpOptions).toPromise();
  }

  async getCarts() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "asx"
      }),

      params: {
        "storeId": localStorage.getItem("storeId")
      }
    }
    return await this.http.get("http://209.58.160.20:7072/carts", httpOptions).toPromise();
  }


  getCartItems(cartId) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "asx"
      }),

    }
    return this.http.get("http://209.58.160.20:7072/carts/" + cartId + "/items", httpOptions).toPromise();
  }

  getOrderItems(cartId) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "asx"
      }),

    }
    return this.http.get("http://209.58.160.20:7072/orders/" + cartId + "/items", httpOptions).toPromise();
  }


  getStoreCategories(page) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "asx"
      }),

      params: {
        "storeId": localStorage.getItem("storeId"),
        "page": "" + page
      }
    }

    return this.http.get(this.pathVariable3 + "/store-categories", httpOptions).toPromise();

  }


  createCategory(body) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "asx"
      })
    }
    return this.http.post<any>(this.pathVariable3 + "/store-categories", body, httpOptions).
      toPromise();
  }


  uploadImage(body, productId, itemCode) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "asx"
      }),
      params: {
        itemCode: itemCode
      }
    }
    this.http.post<any>(this.pathVariable3 + "/stores/" + localStorage.getItem("storeId")
      + "/products/" + productId + "/assets", body, httpOptions).
      toPromise();
  }



  status401() {
    this.router.navigateByUrl('/signin');
  }

  status403() {
    alert("You are not authorized to access such resource")
    this.router.navigateByUrl('/');
  }
}
