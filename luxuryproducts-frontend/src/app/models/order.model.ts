import { Coupon } from "./coupon.model";
import { OrderLine } from "./orderLine.model";
import { Product } from "./product.model";

export class Order {
  public id: number;
  public name: string;
  public infix: string;
  public last_name: string;
  public zipcode: string;
  public houseNumber: number;
  public notes: string;
  public orderDate: string;
  public orderLines: OrderLine[];
  public appliedCoupon: Coupon | null;
}
