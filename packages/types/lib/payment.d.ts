export type PaymentStatus = 'Pending' | 'Fulfilled' | 'Cancelled' | 'Disputed';

export interface Payment {
  payer: string,
  payee: string,
  amount: string,
  currency: string,
  status: PaymentStatus
}