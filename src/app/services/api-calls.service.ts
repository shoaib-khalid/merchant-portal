import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { SuccessAnimationComponent } from 'src/app/modules/home/components/success-animation/success-animation.component';
import { LoadingComponent } from 'src/app/modules/home/components/loading/loading.component';
import { HelperTextService } from 'src/app/helpers/helper-text.service';
@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {
  flowId: any;
  retrievedJson: any;
  data: any = [];
  loadingdialogRef: any;
  vertextType: any;
  pathVariable1: string = environment.url1;
  pathVariable2: string = environment.url2;
  pathVariable3: string = environment.url3;
  pathVariable4: string = environment.url4;

  constructor(private http: HttpClient, private router: Router, private dialog: MatDialog, private helperService: HelperTextService) {


  }


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
      return this.http.post<any>(this.pathVariable1 + "/mxgraph/" + this.flowId, body, httpOptions).toPromise();
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

      "data": this.helperService.verticesData,
      "mxGraphModel": this.helperService.defaultJson.mxGraphModel
    };

    return this.postNewFlowDefaultJson(json);

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
    const httpOptions = {

      headers: new HttpHeaders({
        Authorization: "asx"
      })
    }
    botIds = botIds.filter(String)
    const body = {
      "botIds": botIds
    }
    console.log(body)
    if (this.flowId) {
      try {
        this.http.patch<any>(this.pathVariable1 + "/mxgraph/publish/" + this.flowId, body, httpOptions).toPromise
          ().then((data) => {
            this.successPopUp("Flow Published")
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
    var data: any = await this.http.get(this.pathVariable1 + "/mxgraph/publish/" + this.flowId, httpOptions).toPromise();
  }


  registerClient(signUpData) {

    this.http.post<any>(this.pathVariable2 + "/clients/register", signUpData).
      subscribe(data => {
        if (signUpData.roleId == "STORE_OWNER") {
          this.authenticateClient({ username: signUpData.username, password: signUpData.password })
        } else {

          this.loadingdialogRef.close()
          this.router.navigateByUrl('agent-accounts')
        }
      }, error => {
        this.loadingdialogRef.close()
      });

  }
  authenticateClient(logInData) {

    return this.http.post<any>(this.pathVariable2 + "/clients/authenticate", logInData).
      subscribe(async data => {
        if (data.status == 202) {
          localStorage.setItem('accessToken', data.data.session.accessToken)
          localStorage.setItem('ownerId', data.data.session.ownerId)
          localStorage.setItem('username', data.data.session.username)
          localStorage.setItem('refreshToken', data.data.session.refreshToken)
          localStorage.setItem("created", data.data.session.created)
          localStorage.setItem("expiry", data.data.session.expiry)
          const httpOptions = {
            params: {
              clientId: localStorage.getItem("ownerId")
            }
          }

          var data: any = await this.http.get(this.pathVariable3 + "/stores", httpOptions).toPromise();
          this.loadingdialogRef.close();
          if (data.data.content.length == 0) {
            this.router.navigateByUrl('/chooseverticle')
          } else if (data.data.content.length == 1) {
            localStorage.setItem("storeId", data.data.content[0].id)
            localStorage.setItem("store", data.data.content[0].name)
            this.router.navigateByUrl('/products')
          } else {
            this.router.navigateByUrl('/store-management')

          }
        }
      }, error => this.loadingdialogRef.close());
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

    const httpOptions = {
      params: {
        userId: localStorage.getItem('ownerId')
      }
    }
    return await this.http.get(this.pathVariable2 + "/userChannels", httpOptions).toPromise();
  }

  async createChannel(body) {
    return await this.http.post<any>(this.pathVariable2 + "/userChannels", body).toPromise();
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
    var promise = new Promise(async (resolve, reject) => {

      this.http.post<any>(this.pathVariable3 + "/stores", body).
        subscribe(data => {
          resolve("")
          localStorage.setItem("storeId", data.data.id)
          localStorage.setItem("store", data.data.name)
          this.router.navigateByUrl('/products');
        });
    });
    return promise;
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


  getProducts(page = 0, categoryId) {
    const httpOptions: any = {

      headers: new HttpHeaders({
        Authorization: "asx"
      }),
      params: {
        "pageSize": "15",
        "page": page + ""

      }
    }

    if (categoryId) {
      httpOptions.params["categoryId"] = categoryId;
    }
    if (localStorage.getItem("storeId")) {
      return this.http.get(this.pathVariable3 + "/stores/" + localStorage.getItem("storeId") + "/products", httpOptions).toPromise();
    }
    return { data: { content: [] } };
  }


  addVariant(productId, body) {

    return this.http.post<any>(this.pathVariable3 + "/stores/" + localStorage.getItem("storeId") + "/products/" + productId + "/" + "variants", body).
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

  deleteVariantValue(productId, variantAvailableId) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "asx"
      })
    }

    return this.http.delete<any>
      (this.pathVariable3 + "/stores/" + localStorage.getItem("storeId") + "/products/" +
        productId + "/" + "variants-available/" + variantAvailableId, httpOptions).
      toPromise();
  }

  addInventory(productId, body) {

    return this.http.post<any>(this.pathVariable3 + "/stores/" + localStorage.getItem("storeId") + "/products/" + productId + "/" + "inventory", body).
      toPromise();
  }


  addInventoryItem(productId, body) {

    return this.http.post<any>(this.pathVariable3 + "/stores/" + localStorage.getItem("storeId") + "/products/" + productId + "/" + "inventory-item", body).
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
    if (localStorage.getItem("storeId")) {

      return await this.http.get(this.pathVariable4 + "/orders", httpOptions).toPromise();
    } else {
      this.router.navigateByUrl("/store-management");
      return { data: { content: [] } }
    }
  }

  async getCarts() {
    const httpOptions = {
      headers: new HttpHeaders({

      }),

      params: {
        "storeId": localStorage.getItem("storeId")
      }
    }

    if (localStorage.getItem("storeId")) {
      return await this.http.get(this.pathVariable4 + "/carts", httpOptions).toPromise();
    } else {

      this.router.navigateByUrl("/store-management");
      return { data: { content: [] } }
    }
  }


  getCartItems(cartId) {
    return this.http.get(this.pathVariable4 + "/carts/" + cartId + "/items").toPromise();
  }

  getOrderItems(cartId) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "asx"
      }),

    }
    return this.http.get(this.pathVariable4 + "/orders/" + cartId + "/items", httpOptions).toPromise();
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


  uploadImage(productId, formData, itemCode, isThumbnail) {
    if (isThumbnail == "") {
      isThumbnail = false;
    }
    const httpOptions = {
      headers: new HttpHeaders({
      }),
      params: {
        itemCode: itemCode,
        isThumbnail: isThumbnail
      }
    }
    if (itemCode == "") {

      delete httpOptions.params['itemCode'];

    }
    return this.http.post<any>(this.pathVariable3 + "/stores/" + localStorage.getItem("storeId")
      + "/products/" + productId + "/assets", formData, httpOptions).toPromise();
  }


  getAccessTokenUsingRefresh() {
    const httpOptions = {
      headers: new HttpHeaders({
      }),

    }
    return this.http.post<any>(this.pathVariable2 + "/clients/session/refresh",
      localStorage.getItem("refreshToken"), httpOptions).toPromise();
  }



  status401() {
    this.router.navigateByUrl('/signin');
  }

  status403() {
    alert("You are not authorized to access such resource")
    this.router.navigateByUrl('/');
  }

  getStoreProductById(productId) {
    const httpOptions = {
      headers: new HttpHeaders({
      }),
    }
    return this.http.get(this.pathVariable3 + "/stores/" + localStorage.getItem("storeId")
      + "/products/" + productId, httpOptions).toPromise();
  }

  successPopUp(message, time = 1200,height = '220px') {

    const dialogRef = this.dialog.open(SuccessAnimationComponent, {
      disableClose: true,
      width: '350px',
      height: height,
      data: { message: message }
    });

    setTimeout(() => {
      dialogRef.close();
    }, time)
  }

  updateProduct(body, productId) {
    const httpOptions = {
      headers: new HttpHeaders({
      }),
    }
    this.http.put<any>(
      this.pathVariable3 + `/stores/${localStorage.getItem("storeId")}/products/${productId}`, body, httpOptions
    ).subscribe(data => {
    });
  }

  deleteProductAsset(productId, assetId) {
    this.http.delete<any>(this.pathVariable3 +
      `/stores/${localStorage.getItem("storeId")}/products/${productId}/assets/${assetId}`)
      .subscribe((data) => console.log(data));
  }

  deleteVariant(productId, variantId) {
    this.http.delete<any>(this.pathVariable3 +
      `/stores/${localStorage.getItem("storeId")}/products/${productId}/variants/${variantId}`)
      .subscribe((data) => console.log(data));
  }

  deleteInventory(productId, id) {
    return this.http.delete<any>(`${this.pathVariable3}/stores/${localStorage.getItem("storeId")}/products/${productId}/inventory/${id}`)
      .toPromise();
  }



  loadingAnimation(message, width = "250px") {

    this.loadingdialogRef = this.dialog.open(LoadingComponent, {
      disableClose: true,
      width: width,
      height: '130px',
      data: { message: message }
    });

  }


  getVariantAvailables(productId) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "asx"
      })
    }

    return this.http.get<any>(this.pathVariable3 + "/stores/" + localStorage.getItem("storeId") + "/products/" + productId + "/" + "variants-available", httpOptions).
      toPromise();

  }

  async uploadStoreAssets(body, id) {
    const data = await this.http.post<any>(this.pathVariable3 +
      `/stores/${id}/assets`, body).toPromise();
    this.loadingdialogRef.close();

  }

  getStoreDetails(id) {
    return this.http.get<any>(this.pathVariable3 + `/stores/${id}`).
      toPromise();
  }

  getStoreAssets(id) {
    return this.http.get<any>(this.pathVariable3 + `/stores/${id}/assets`).
      toPromise();
  }

  updateStore(body, id) {
    return this.http.put<any>(
      this.pathVariable3 + `/stores/${id}`, body).toPromise()
  }
  deleteStoreAssets(id) {
    return this.http.delete<any>(
      this.pathVariable3 +
      `/stores/${localStorage.getItem("storeId")}/assets/${id}`).toPromise()
  }

  getCustomers(page = 0) {

    return this.http.get(
      `${this.pathVariable2}/stores/${localStorage.getItem('storeId')}/customers/?page=${page}&pageSize=15`).toPromise();
  }

  getClients(roleId) {
    const httpOptions = {
      params: {
        roleId: roleId,
        storeId: localStorage.getItem('storeId')
      }
    }
    return this.http.get<any>(this.pathVariable2 + `/clients/`, httpOptions).
      toPromise();
  }

  getClient(id) {
    return this.http.get<any>(this.pathVariable2 + `/clients/${id}`).
      toPromise();
  }

  updateClient(id, body) {
    return this.http.put<any>(this.pathVariable2 + `/clients/${id}`, body).
      toPromise();
  }

  async deleteProduct(id) {
    return this.http.delete(`${this.pathVariable3}/stores/${localStorage.getItem('storeId')}/products/${id}`).toPromise();

  }

  loadFbPages() {
    return this.http.get<any>(`https://graph.facebook.com/${localStorage.getItem('fb-user-id')}/accounts?access_token=${localStorage.getItem('fb-user-accessToken')}`)
  }
  checkConnectedFbPages() {
    return this.http.get<any>(`https://graph.facebook.com/me/accounts?access_token=${localStorage.getItem('fb-user-accessToken')}`)
  }
  connectFbPageToSymplified(pageAccessToken, pageId) {
    return this.http.post<any>(`https://graph.facebook.com/${pageId}/subscribed_apps?subscribed_fields=messages, messaging_postbacks&access_token=${pageAccessToken}`, {})
  }

  checkFbPageConnection(pageId, pageAccessToken) {
    return this.http.get<any>(`https://graph.facebook.com/${pageId}/subscribed_apps?access_token=${pageAccessToken}`)
  }

  saveDeliveryDetails(body, productId) {
    this.http.post<any>(this.pathVariable3 + `/stores/${localStorage.getItem('storeId')}/products/${productId}/deliverydetails`, body)
      .subscribe(data => {
      })
  }

  async getDeliveryDetails(productId) {
    return this.http.get<any>(this.pathVariable3 + `/stores/${localStorage.getItem('storeId')}/products/${productId}/deliverydetails`).toPromise();
  }
  updateDeliveryDetails(body, productId) {
    this.http.put<any>(this.pathVariable3 + `/stores/${localStorage.getItem('storeId')}/products/${productId}/deliverydetails`, body)
      .subscribe(data => {

      },
        error => {
          console.log("Delivery Details not found! Please add new product with new delivery details")
        })
  }
  async deleteProductCategory(id) {
    return this.http.delete(this.pathVariable3 + `/store-categories/${id}`).toPromise();
  }

  getOrderDetails(orderId) {
    return this.http.get<any>(this.pathVariable4 + `/orders/${orderId}`).toPromise();
  }

  getShipmentDetails(orderId) {
    return this.http.get<any>(this.pathVariable4 + `/orders/${orderId}/shipment-details`).toPromise();
  }


  async getLongLivedAppAccessToken1(fb_exchange_token) {
    return this.http.get<any>
      (`https://graph.facebook.com/v2.11/oauth/access_token?grant_type=fb_exchange_token&client_id=${environment.client_id}&client_secret=${environment.client_secret}&fb_exchange_token=${fb_exchange_token}`).toPromise();
  }

  async getLongLivedPageAccessToken(longLivedAppAccessToken) {
    return this.http.get<any>
      (`https://graph.facebook.com/v2.11/${localStorage.getItem('fb-user-id')}/accounts?access_token=${longLivedAppAccessToken}`).toPromise();

  }

  storeLongLivedPageAccessToken(accessToken, pageId) {
    const body = {
      appId: pageId,
      userId: localStorage.getItem('fb-user-id'),
      token: accessToken
    }
    this.http.post(this.pathVariable2 + "/apptokens", body).subscribe(data => {
      console.log(data)
    })
  }

  getStoreRegions() {
    return this.http.get(this.pathVariable3 + `/region-countries`).toPromise();
  }

  fetchChannels(){
    return this.http.get(this.pathVariable2+'/availablechannels').toPromise()
  }

  deleteUserChannel(channelId){
    return this.http.delete(this.pathVariable2+`/userChannels/${channelId}`).toPromise();
  }
}
