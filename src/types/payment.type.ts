export interface createURLPayment {
  metadata?: {
    paymentId?: string;
    redirectUrl?: string;
    amount?: number;
    planName?: string;
  };
}
