export class DiscountTier {
    constructor(
        public id:string='',
        public discountId: string = '',
        public minSubTotal: string = '',
        public maxSubTotal: string = '',
        public discountAmount: string = '',
        public calculationType: any = ''
    ) {

    }
}