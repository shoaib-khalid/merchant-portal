export interface IAppConfig {
    env: {
        name: string;
    };
    services: {
        flowBuilderService: string;
        userService: string;
        productService:string;
        orderService:string;
        reportService:string;
        deliveryService:string;
        paymentService:string;

    };
    storeNames:[name:String]
}