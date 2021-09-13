export class DiscountTier {
    constructor(
        public minSubTotal: string = '',
        public maxSubTotal: string = '',
        public discountAmount: string = '',
        public calculationType: any = '',
    ) {

    }
}