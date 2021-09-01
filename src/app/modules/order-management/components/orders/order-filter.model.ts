export class OrderFilter {
    constructor(
        public receiverName: String,
        public phoneNumber: String,
        public from: String,
        public to: String,
        public paymentStatus: String,
        public completionStatus: String
    ) {

    }
}