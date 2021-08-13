export class Store {
    constructor(
        public storeName: string,
        public email: String,
        public paymentType: string,
        public region: any,
        public city: string,
        public address: string,
        public storeInfo: string,
        public postCode: string,
        public minOrderQty: number,  // nazrul : albert wants default value to start with 5
        public serviceCharge: number,
        public verticleCode: string,
        public packType: string,
        public deliveryType: string,
        public stateCharges:any,
        public storePickUp:boolean,
        public deliveryServiceProviders:any,
        public deliveryServiceProvider:any
    ) {

    }
}