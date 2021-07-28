import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { SuccessAnimationComponent } from 'src/app/modules/home/components/success-animation/success-animation.component';
import { LoadingComponent } from 'src/app/modules/home/components/loading/loading.component';
import { HelperTextService } from 'src/app/helpers/helper-text.service';
import { HelperMethodsService } from './helper-methods.service';
import { AppConfig } from './app.config.ts.service';
import { SuggestionPopupComponent } from 'src/app/modules/agent-management/components/agents/suggestion-popup/suggestion-popup.component';

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {
  protected services = AppConfig.settings.services;
  flowId: any;
  retrievedJson: any;
  data: any = [];
  loadingdialogRef: any;
  vertextType: any;
  private pathVariable1: string = this.services.flowBuilderService;
  private userService: string = this.services.userService;
  private productService: string = this.services.productService;
  private orderService: string = this.services.orderService;
  private reportService: string = this.services.reportService;

  constructor(private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private helperService: HelperTextService,
    private helperService2: HelperMethodsService) {
    this.updateFlowBuilderJson();
  }


  async getAllflows() {
    return await this.http.get(this.pathVariable1 + "/flow/getall/" + localStorage.getItem("ownerId")).toPromise();
  }

  async retrieveGraph() {
    return await this.http.get(this.pathVariable1 + "/mxgraph/" + this.flowId)
      .toPromise();
  }

  postNewFlowDefaultJson(json) {
    const body: any = json;
    console.log("Flow id when posting: " + this.flowId)
    return this.http.post<any>(this.pathVariable1 + "/mxgraph/" + this.flowId, body).toPromise();
  }


  async getFlowId(title, description) {

    var body = {
      "botId": "",
      "description": description,
      "title": title,
      "topVertexId": "",
      "ownerId": localStorage.getItem("ownerId"),
      'storeId': localStorage.getItem('storeId')
    }

    var data = await this.http.post<any>(this.pathVariable1 + "/flow/", body).toPromise();

    this.flowId = data.data.id;
    const json = {
      "data": this.helperService.verticesData,
      "mxGraphModel": this.helperService.defaultJson.mxGraphModel
    };

    return this.postNewFlowDefaultJson(json);
  }


  async autoSaveAdd(object, type) {

    object = JSON.parse(object);
    var body = { "data": this.data, object };

    if (this.flowId) {
      console.log("Updating after addition")
      try {
        return await this.http.patch<any>(this.pathVariable1 + "/mxgraph/ADD/" + this.flowId, body).toPromise
          ();
      } catch (ex) {
      }
    }
  }


  autoSaveDelete(object) {

    object = JSON.parse(object)
    var body = { object };
    if (this.flowId) {

      try {
        this.http.patch<any>(this.pathVariable1 + "/mxgraph/DELETE/" + this.flowId, body).toPromise
          ().then((data) => {
            console.log("Flow updated after deletion!")
          });
      } catch (ex) {
      }
    }
  }


  autoSaveUpdate(object) {
    object = JSON.parse(object);
    var body = { "data": this.data, object };
    if (this.flowId) {
      try {
        this.http.patch<any>(this.pathVariable1 + "/mxgraph/UPDATE/" + this.flowId, body).toPromise
          ().then((data) => {
            console.log("Flow Updated after change!")
          });
      } catch (ex) {
      }
    }
  }

  publishmxGraph(botIds, flowId = this.flowId) {
    this.flowId = flowId;
    const httpOptions = {

      headers: new HttpHeaders({
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

    var data: any = await this.http.get(this.pathVariable1 + "/mxgraph/publish/" + this.flowId).toPromise();
  }


  registerClient(signUpData) {

    this.http.post<any>(this.userService + "/clients/register", signUpData).
      subscribe(data => {
        if (signUpData.roleId == "STORE_OWNER") {
          this.authenticateClient({ username: signUpData.username, password: signUpData.password })
        } else {

          this.loadingdialogRef.close()
          this.router.navigateByUrl('agent-accounts')
          this.showPopUpIfOneAgent()
        }
      }, error => {
        this.loadingdialogRef.close()
      });

  }

  async showPopUpIfOneAgent() {
    const data: any = await this.getFilteredAccounts({})
    if (data.data.content.length == 1) {
      this.openSuggestionDialog("Please download the Mobile App", "", "290px", "160px")
    }
  }

  authenticateClient(logInData, rememberMe = true) {

    return this.http.post<any>(this.userService + "/clients/authenticate", logInData).
      subscribe(async data => {
        if (data.status == 202) {
          this.helperService2.setUserDetailsOnAuthentication(data, rememberMe);
          const httpOptions = {
            params: {
              clientId: localStorage.getItem("ownerId")
            }
          }
          var data: any = await this.http.get(this.productService + "/stores", httpOptions).toPromise();
          this.loadingdialogRef.close();
          if (data.data.content.length == 0) {
            this.router.navigateByUrl('/chooseverticle')
          } else if (data.data.content.length == 1) {
            localStorage.setItem("storeId", data.data.content[0].id)
            localStorage.setItem("store", data.data.content[0].name)
            this.helperService.setDefaultJson(data.data.content[0].phoneNumber, data.data.content[0].domain,data.data.content[0].name)
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

    return this.http.get(this.productService + "/stores", httpOptions).toPromise();
  }

  async getUserChannels() {

    const httpOptions = {
      params: {
        userId: localStorage.getItem('ownerId')
      }
    }
    return await this.http.get(this.userService + "/userChannels", httpOptions).toPromise();
  }

  async createChannel(body) {
    return await this.http.post<any>(this.userService + "/userChannels", body).toPromise();
  }

  updateFlowDetails(body) {
    this.http.patch<any>(this.pathVariable1 + "/flow/" + this.flowId, body).toPromise
      ().then((data) => {
        console.log("Flow Details Updated")
      });
  }

  async retrieveFlowDetails(id) {
    return await this.http.get(this.pathVariable1 + "/flow/" + id).toPromise();
  }


  registerStore(body) {
    var promise = new Promise(async (resolve, reject) => {

      this.http.post<any>(this.productService + "/stores", body).
        subscribe(data => {
          localStorage.setItem("storeId", data.data.id)
          localStorage.setItem("store", data.data.name)
          this.helperService.setDefaultJson(data.data.phoneNumber, data.data.domain, data.data.name)
          resolve("")
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
    return this.http.post<any>(this.productService + "/stores/" + localStorage.getItem("storeId") + "/" + "products", body).toPromise();
  }


  getProducts(page = 0, categoryId) {
    const httpOptions: any = {

      headers: new HttpHeaders({
        Authorization: "asx"
      }),
      params: {
        "pageSize": "10",
        "page": page + "",
        status: ['ACTIVE', 'DRAFT', 'INACTIVE']

      }
    }

    if (categoryId) {
      httpOptions.params["categoryId"] = categoryId;
    }
    if (localStorage.getItem("storeId")) {
      return this.http.get(this.productService + "/stores/" + localStorage.getItem("storeId") + "/products", httpOptions).toPromise();
    }
    return { data: { content: [] } };
  }

  getFilteredProducts(parameters) {
    console.log(parameters)
    const httpOptions: any = {

      headers: new HttpHeaders({
      }),
      params: parameters
    }

    if (localStorage.getItem("storeId")) {
      return this.http.get(this.productService + "/stores/" + localStorage.getItem("storeId") + "/products", httpOptions).toPromise();
    }
    return { data: { content: [] } };
  }


  addVariant(productId, body) {

    return this.http.post<any>(this.productService + "/stores/" + localStorage.getItem("storeId") + "/products/" + productId + "/" + "variants", body).
      toPromise();
  }

  addVariantValues(productId, body) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "asx"
      })
    }

    return this.http.post<any>(this.productService + "/stores/" + localStorage.getItem("storeId") + "/products/" + productId + "/" + "variants-available", body, httpOptions).
      toPromise();
  }

  deleteVariantValue(productId, variantAvailableId) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "asx"
      })
    }

    return this.http.delete<any>
      (this.productService + "/stores/" + localStorage.getItem("storeId") + "/products/" +
        productId + "/" + "variants-available/" + variantAvailableId, httpOptions).
      toPromise();
  }

  addInventory(productId, body) {

    return this.http.post<any>(this.productService + "/stores/" + localStorage.getItem("storeId") + "/products/" + productId + "/" + "inventory", body).
      toPromise();
  }


  addInventoryItem(productId, body) {

    return this.http.post<any>(this.productService + "/stores/" + localStorage.getItem("storeId") + "/products/" + productId + "/" + "inventory-item", body).
      toPromise();
  }

  async getOrders(customerId = null, page = 0) {
    const httpOptions: any = {
      headers: new HttpHeaders({
      }),

      params: {
        "storeId": localStorage.getItem("storeId"),
        "page": page,
        "pageSize": 10
      }
    }
    if (customerId) {
      httpOptions.params.customerId = customerId;
    }
    if (localStorage.getItem("storeId")) {

      return await this.http.get(this.orderService + "/orders", httpOptions).toPromise();
    } else {
      this.router.navigateByUrl("/store-management");
      return { data: { content: [] } }
    }
  }

  async getFilteredOrders(parameters) {
    parameters.storeId = localStorage.getItem('storeId')
    const httpOptions: any = {
      headers: new HttpHeaders({
      }),

      params: parameters
    }
    if (localStorage.getItem("storeId")) {
      return await this.http.get(this.orderService + "/orders", httpOptions).toPromise();
    } else {
      this.router.navigateByUrl("/store-management");
      return { data: { content: [] } }
    }
  }

  async getFilteredAccounts(parameters) {
    parameters.storeId = localStorage.getItem('storeId')
    const httpOptions: any = {
      headers: new HttpHeaders({
      }),
      params: parameters
    }
    if (localStorage.getItem("storeId")) {
      return await this.http.get(this.userService + "/clients/", httpOptions).toPromise();
    }
  }
  async getFilteredCustomers(parameters) {
    const httpOptions: any = {
      headers: new HttpHeaders({
      }),

      params: parameters
    }
    if (localStorage.getItem("storeId")) {
      return await this.http.get(this.userService + `/stores/${localStorage.getItem('storeId')}/customers/`, httpOptions).toPromise();
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
      return await this.http.get(this.orderService + "/carts", httpOptions).toPromise();
    } else {

      this.router.navigateByUrl("/store-management");
      return { data: { content: [] } }
    }
  }


  getCartItems(cartId) {
    return this.http.get(this.orderService + "/carts/" + cartId + "/items").toPromise();
  }

  getOrderItems(cartId) {
    const httpOptions = {
      headers: new HttpHeaders({
      }),

    }
    return this.http.get(this.orderService + "/orders/" + cartId + "/items", httpOptions).toPromise();
  }


  getStoreCategories(page) {
    const httpOptions = {
      headers: new HttpHeaders({
      }),
      params: {
        "storeId": localStorage.getItem("storeId"),
        "page": "" + page
      }
    }
    return this.http.get(this.productService + "/store-categories", httpOptions).toPromise();

  }
  getStoreCategoryById(storeCategoryId) {
    const httpOptions = {
      headers: new HttpHeaders({
      }),
      params: {
        "storeId": localStorage.getItem("storeId")
      }
    }
    return this.http.get(this.productService + `/store-categories/${storeCategoryId}`, httpOptions).toPromise();

  }


  createCategory(body, name) {
    const httpOptions = {
      headers: new HttpHeaders({
      }),
      params: {
        name: name,
        storeId: localStorage.getItem('storeId')
      }
    }
    return this.http.post<any>(this.productService + `/store-categories`, body, httpOptions).
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
    return this.http.post<any>(this.productService + "/stores/" + localStorage.getItem("storeId")
      + "/products/" + productId + "/assets", formData, httpOptions).toPromise();
  }

  updateStoreCategory(body, name, id) {
    const httpOptions = {
      headers: new HttpHeaders({
      }),
      params: {
        name: name,
        storeId: localStorage.getItem('storeId')
      }
    }
    return this.http.put<any>(this.productService + `/store-categories/${id}`, body, httpOptions).
      toPromise();
  }

  updateProductImage(productId, body, id) {
    return this.http.put<any>(this.productService + "/stores/" + localStorage.getItem("storeId")
      + "/products/" + productId + "/assets/" + id, body).toPromise();
  }

  getAccessTokenUsingRefresh() {
    const httpOptions = {
      headers: new HttpHeaders({
      }),

    }
    return this.http.post<any>(this.userService + "/clients/session/refresh",
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
    return this.http.get(this.productService + "/stores/" + localStorage.getItem("storeId")
      + "/products/" + productId, httpOptions).toPromise();
  }

  successPopUp(message, time = 1200, height = '220px') {

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
      this.productService + `/stores/${localStorage.getItem("storeId")}/products/${productId}`, body, httpOptions
    ).subscribe(data => {
    });
  }

  deleteProductAsset(productId, assetId) {
    return this.http.delete<any>(this.productService +
      `/stores/${localStorage.getItem("storeId")}/products/${productId}/assets/${assetId}`)
      .subscribe((data) => console.log(data));
  }

  deleteVariant(productId, variantId) {
    this.http.delete<any>(this.productService +
      `/stores/${localStorage.getItem("storeId")}/products/${productId}/variants/${variantId}`)
      .subscribe((data) => console.log(data));
  }

  deleteInventory(productId, id) {
    return this.http.delete<any>(`${this.productService}/stores/${localStorage.getItem("storeId")}/products/${productId}/inventory/${id}`)
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
      })
    }

    return this.http.get<any>(this.productService + "/stores/" + localStorage.getItem("storeId") + "/products/" + productId + "/" + "variants-available", httpOptions).
      toPromise();

  }

  async uploadStoreAssets(body, id) {
    const data = await this.http.post<any>(this.productService +
      `/stores/${id}/assets`, body).toPromise();

  }

  getStoreDetails(id) {
    return this.http.get<any>(this.productService + `/stores/${id}`).
      toPromise();
  }

  getStoreAssets(id) {
    return this.http.get<any>(this.productService + `/stores/${id}/assets`).
      toPromise();
  }

  updateStore(body, id) {
    return this.http.put<any>(
      this.productService + `/stores/${id}`, body).toPromise()
  }
  deleteStoreAssets(id) {
    return this.http.delete<any>(
      this.productService +
      `/stores/${localStorage.getItem("storeId")}/assets/${id}`).toPromise()
  }

  getCustomers(page = 0) {

    return this.http.get(
      `${this.userService}/stores/${localStorage.getItem('storeId')}/customers/?page=${page}&pageSize=15`).toPromise();
  }

  getClients() {
    const httpOptions = {
      params: {
        storeId: localStorage.getItem('storeId')
      }
    }
    return this.http.get<any>(this.userService + `/clients/`, httpOptions).
      toPromise();
  }

  getClient(id) {
    return this.http.get<any>(this.userService + `/clients/${id}`).
      toPromise();
  }

  updateClient(id, body) {
    return this.http.put<any>(this.userService + `/clients/${id}`, body).
      toPromise();
  }

  async deleteProduct(id) {
    return this.http.delete(`${this.productService}/stores/${localStorage.getItem('storeId')}/products/${id}`).toPromise();

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
    this.http.post<any>(this.productService + `/stores/${localStorage.getItem('storeId')}/products/${productId}/deliverydetails`, body)
      .subscribe(data => {
      })
  }

  async getDeliveryDetails(productId) {
    return this.http.get<any>(this.productService + `/stores/${localStorage.getItem('storeId')}/products/${productId}/deliverydetails`).toPromise();
  }
  updateDeliveryDetails(body, productId) {
    this.http.put<any>(this.productService + `/stores/${localStorage.getItem('storeId')}/products/${productId}/deliverydetails`, body)
      .subscribe(data => {

      },
        error => {
          console.log("Delivery Details not found! Please add new product with new delivery details")
        })
  }
  async deleteProductCategory(id) {
    return this.http.delete(this.productService + `/store-categories/${id}`).toPromise();
  }

  getOrderDetails(orderId) {
    return this.http.get<any>(this.orderService + `/orders/${orderId}`).toPromise();
  }

  getShipmentDetails(orderId) {
    return this.http.get<any>(this.orderService + `/orders/${orderId}/shipment-details`).toPromise();
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
    this.http.post(this.userService + "/apptokens", body).subscribe(data => {
      console.log(data)
      location.reload()

    })
  }

  getStoreRegions() {
    return this.http.get(this.productService + `/region-countries`).toPromise();
  }

  fetchChannels() {
    return this.http.get(this.userService + '/availablechannels').toPromise()
  }

  deleteUserChannel(channelId) {
    return this.http.delete(this.userService + `/userChannels/${channelId}`).toPromise();
  }

  getStoreByName(storeName: any) {
    const httpOptions = {
      params: {
        'name': storeName
      }
    }
    return this.http.get(this.productService + `/stores`, httpOptions).toPromise()
  }
  /**
   * 
   * @returns returns daily sales from last days
   */
  fetchDailySales() {
    var d = new Date();
    const endDate = d.toISOString().slice(0, 10)
    // const endDate = "2021-07-22"
    d.setDate(d.getDate() - 6);
    const startDate = d.toISOString().slice(0, 10);
    // const startDate = "2021-07-01"
    return this.http.get(`${this.reportService}/store/${localStorage.getItem("storeId")}/daily_sales?from=${startDate}&to=${endDate}`).toPromise()
  }

  fetchDetailedDailySalesByDates(startDate, endDate) {
    return this.http.get(`${this.reportService}/store/${localStorage.getItem("storeId")}/daily_sales?from=${startDate}&to=${endDate}`).toPromise()
  }

  fetchDetailedDailySales(startDate, endDate) {
    return this.http.get(`${this.reportService}/store/${localStorage.getItem("storeId")}/report/detailedDailySales?startDate=${startDate}&endDate=${endDate}`).toPromise()
  }

  /**
   * 
   * @returns top products from last 7 days
   */
  getTopProducts() {
    var d = new Date();
    const endDate = d.toISOString().slice(0, 10)
    d.setDate(d.getDate() - 6);
    const startDate = d.toISOString().slice(0, 10);
    return this.http.get(`${this.reportService}/store/${localStorage.getItem("storeId")}/report/dailyTopProducts?startDate=${startDate}&endDate=${endDate}`).toPromise()
  }

  getTopProductsByDates(startDate, endDate) {
    return this.http.get(`${this.reportService}/store/${localStorage.getItem("storeId")}/report/dailyTopProducts?startDate=${startDate}&endDate=${endDate}`).toPromise()
  }

  saveStoreTimmings(timmings) {
    return this.http.post(this.productService + `/stores/${localStorage.getItem('storeId')}/timings`, timmings).toPromise();
  }

  getStoreTimmings(storeId) {
    return this.http.get(this.productService + `/stores/${storeId}/timings`).toPromise();
  }

  updateStoreTimmings(timmings, day, id) {
    return this.http.put(`${this.productService}/stores/${id}/timings/${day}`, timmings).toPromise();
  }
  getMonthlySales(startMonth, endMonth) {
    return this.http.get(`${this.reportService}/store/${localStorage.getItem('storeId')}/report/monthlySales?endMonth=${endMonth}&startMonth=${startMonth}`).toPromise();
  }

  async saveDeliveryDetailsStore(body) {
    return this.http.post(this.productService + `/stores/${localStorage.getItem("storeId")}/deliverydetails`, body).toPromise();
  }

  async getDeliveryDetailsStore(storeId) {
    return this.http.get(this.productService + `/stores/${storeId}/deliverydetails`).toPromise()
  }
  async updateDeliveryDetailsStore(storeId, body) {
    return this.http.put(this.productService + `/stores/${storeId}/deliverydetails`, body).toPromise()
  }
  async getStates(regionId) {
    return this.http.get(this.productService + `/region-country-state?page=0&pageSize=20&regionCountryId=${regionId}`).toPromise()
  }
  async getSettlement(from, to) {
    return this.http.get(this.reportService + `/store/${localStorage.getItem('storeId')}/settlement?from=${from}&page=0&pageSize=20&sortBy=startDate&sortingOrder=ASC&to=${to}`).toPromise()
  }

  verifyEmail(id, code) {
    const sanitizedParams = this.userService + `/clients​/${id}​/email-verification​/${code}​/verify`.replace(/[^\x00-\x7F]/g, "");
    return this.http.get(sanitizedParams).toPromise()
  }

  resetPassword(email) {
    return this.http.get(this.userService + `/clients/${email}/password_reset`).toPromise();
  }

  newPassword(id, code, body) {
    return this.http.put(this.userService + `/clients/${id}/password/${code}/reset`, body).toPromise();
  }

  openSuggestionDialog(title, text, width = '250px', height = '200px') {
    const dialogRef = this.dialog.open(SuggestionPopupComponent, {
      width: width,
      height: height,
      data: { title: title, message: text }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  deleteAgentAccount(id) {
    return this.http.delete(this.userService + `/clients/${id}`).toPromise();
  }

  checkCountry() {
    return this.http.get("https://extreme-ip-lookup.com/json").toPromise();
  }


  getRegionVerticles() {
    return this.http.get(this.productService + `/region-verticals`).toPromise()
  }

  orderUpdationCompletionStatus(orderId) {
    return this.http.put(this.orderService + `/orders/${orderId}/completion-status-updates/request-delivery`, {}).toPromise()
  }

  async updateFlowBuilderJson() {
    if (localStorage.getItem('storeId')) {
      const data = await this.getStoreDetails(localStorage.getItem('storeId'));
      this.helperService.setDefaultJson(data.data.phoneNumber, data.data.domain, data.data.name);
    }
  }

  async sendEmail() {
      return this.http.post("http:localhost/zoo-keeper/handler.php",{"email":"email@aksj.com"}).toPromise()
    }
}
