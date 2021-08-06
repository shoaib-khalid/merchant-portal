export class Product {
    constructor(
        public categoryId: String,
        public name: String,
        public status: String,
        public description: String,
        public storeId: String,
        public allowOutOfStockPurchases: boolean,
        public trackQuantity: boolean,
        public minQuantityForAlarm: number
    ) {

    }
}