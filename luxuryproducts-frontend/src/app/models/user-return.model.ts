import { OrderLine } from "./orderLine.model";
import { Product } from "./product.model";

export class UserReturn {
  public id: number;
  public name: string;
  public infix: string;
  public last_name: string;
  public returnDate: string;
  public status: string;
  public orderLines: OrderLine[];
}
