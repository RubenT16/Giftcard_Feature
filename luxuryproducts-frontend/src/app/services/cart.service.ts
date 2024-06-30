import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, catchError, throwError } from "rxjs";
import { Product } from "../models/product.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Form, FormGroup } from "@angular/forms";
import { Order } from "../models/order.model";

const localStorageKey: string = "products-in-cart";

@Injectable({
  providedIn: "root",
})
export class CartService {
  private productsInCart: Product[] = [];
  public $productInCart: BehaviorSubject<Product[]> = new BehaviorSubject<
    Product[]
  >([]);
  private baseUrl: string = environment.base_url + "/orders";

  constructor(private http: HttpClient) {
    this.loadProductsFromLocalStorage();
  }

  public addProductToCart(productToAdd: Product) {
    const existingProductIndex: number = this.productsInCart.findIndex(
      (product) => product.name === productToAdd.name,
    );

    if (existingProductIndex !== -1) {
      this.productsInCart[existingProductIndex].amount += 1;
    } else {
      productToAdd.amount = 1;
      this.productsInCart.push(productToAdd);
    }

    this.saveProductsAndNotifyChange();
  }

  public removeProductFromCart(productIndex: number) {
    if (this.productsInCart[productIndex].amount > 1) {
      this.productsInCart[productIndex].amount -= 1;
    } else {
      this.productsInCart.splice(productIndex, 1);
    }

    this.saveProductsAndNotifyChange();
  }

  public clearCart() {
    this.productsInCart = [];
    this.saveProductsAndNotifyChange();
  }

  public allProductsInCart(): Product[] {
    return this.productsInCart.slice();
  }

  public addOrder(orderDTO: any): Observable<string> {
    console.log("Ontvangen order: " + orderDTO);

    return this.http.post<string>(this.baseUrl, orderDTO).pipe(
      catchError((error) => {
        console.error("Error adding order:", error);
        return throwError(() => new Error(error)); // Use throwError as a factory
      }),
    );
  }

  // ------------ PRIVATE ------------------

  private saveProductsAndNotifyChange(): void {
    this.saveProductsToLocalStorage(this.productsInCart.slice());
    this.$productInCart.next(this.productsInCart.slice());
  }

  private saveProductsToLocalStorage(products: Product[]): void {
    localStorage.setItem(localStorageKey, JSON.stringify(products));
  }

  private loadProductsFromLocalStorage(): void {
    const productsOrNull = localStorage.getItem(localStorageKey);
    if (productsOrNull != null) {
      const products: Product[] = JSON.parse(productsOrNull);
      this.productsInCart = products;
      this.$productInCart.next(this.productsInCart.slice());
    }
  }
}
