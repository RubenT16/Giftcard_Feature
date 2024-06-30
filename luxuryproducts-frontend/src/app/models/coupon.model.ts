export class Coupon {
  public id: number;
  public code: string;
  public discountAmount: number;
  public expiryDate: Date;
  public percentage: boolean;
  public active: boolean;
  public usageAmount: number;
}
