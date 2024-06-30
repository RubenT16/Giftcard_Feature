import { Component, OnInit } from "@angular/core";
import {CurrencyPipe, NgClass, NgFor, NgIf} from "@angular/common";
import { CartService } from "../services/cart.service";
import { Product } from "../models/product.model";
import { Router } from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { CouponService } from "../services/coupon.service";
import { Coupon } from "../models/coupon.model";
import { FormsModule } from "@angular/forms";
import { catchError, of } from "rxjs";
import { GiftCardService } from "../services/gift-card.service";
import { HttpClient } from "@angular/common/http";



@Component({
  selector: "app-cart",
  standalone: true,
  imports: [CurrencyPipe, NgFor, NgIf, FormsModule, NgClass],
  templateUrl: "./cart.component.html",
  styleUrl: "./cart.component.scss",
})
export class CartComponent implements OnInit {
  public products_in_cart: Product[];
  public userIsLoggedIn: boolean = false;
  public amountOfProducts: number = 0;
  public totalPrice: number;

  public appliedCoupon: Coupon | null = null;
  public coupons: Coupon[];

  public couponCode: string;
  public couponMessage: string;
  public isError: boolean;

  public giftCardCode: string;
  public giftCardError: string;
  public giftCardSuccess: string;
  public discountAmount:number;

  constructor(
    private cartService: CartService,
    private router: Router,
    private authService: AuthService,
    private couponService: CouponService,
    private giftCardService:GiftCardService,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.products_in_cart = this.cartService.allProductsInCart();
    let orderDiscount=this.giftCardService.getDiscountAmountAndCode();
    if(orderDiscount){
      this.discountAmount=orderDiscount.discountAmount;
      this.giftCardCode=orderDiscount.giftCardCode;
      this.giftCardSuccess=orderDiscount.giftCardSuccess;
    }
    this.totalPrice = this.getTotalPrice();
    this.cartService.$productInCart.subscribe((products: Product[]) => {
      this.products_in_cart = products;
      this.amountOfProducts = products.length;
      this.checkLoginState();
    });

    this.couponService
      .getCoupons()
      .pipe(
        catchError((error) => {
          console.error("There was an error!", error);
          return of([]); // Return an empty array on error
        }),
      )
      .subscribe((coupons: Coupon[]) => {
        this.coupons = coupons;
      });
  }

  public clearCart() {
    this.cartService.clearCart();
  }

  public removeProductFromCart(product_index: number) {
    this.cartService.removeProductFromCart(product_index);
  }

  public getTotalPrice(): number {
    let totalPrice = this.products_in_cart.reduce(
      (total, product) => total + product.price * product.amount,
      0,
    );

    if (this.appliedCoupon) {
      if (this.appliedCoupon.percentage) {
        totalPrice -= totalPrice * (this.appliedCoupon.discountAmount / 100);
      } else {
        totalPrice -= this.appliedCoupon.discountAmount;
      }
    }

    if(this.discountAmount){
      totalPrice-=this.discountAmount;
    }
    return Math.max(totalPrice, 0);
  }

  onInvalidOrder() {
    return this.amountOfProducts === 0;
  }

  onOrder() {
    if (!this.userIsLoggedIn) {
      this.router.navigateByUrl("/auth/login");
    } else {
      this.router.navigateByUrl("/orders");
    }
  }

  public checkLoginState(): void {
    this.authService.$userIsLoggedIn.subscribe((loginState: boolean) => {
      this.userIsLoggedIn = loginState;
    });
  }

  public applyCoupon() {
    this.couponMessage = "";
    this.isError = true;

    if (!this.couponCode) {
      this.couponMessage = "No coupon code provided";
      return;
    }

    const couponToApply = this.coupons.find(
        (coupon) => coupon.code === this.couponCode,
    );

    if (!couponToApply) {
      this.couponMessage = "Coupon code not found";
      return;
    }

    if (this.appliedCoupon) {
      this.couponMessage = "A coupon has already been applied";
      return;
    }

    const isValid = this.couponService.validateCoupon(couponToApply);
    if (!isValid) {
      this.couponMessage = "Coupon is not valid";
      return;
    }
    couponToApply.usageAmount -= 1;
    this.appliedCoupon = couponToApply;
    this.couponService.setAppliedCoupon(this.appliedCoupon);
    this.isError = false;
    this.couponMessage = "Coupon applied successfully";
    this.updateTotalPrice();
  }
  public applyGiftCard(){
    this.giftCardError = "";
    this.giftCardSuccess = "";
    if(!this.giftCardCode){
      this.giftCardError="No gift card code provided"
    }
    this.giftCardService.redeemGiftCard(this.giftCardCode,this.getTotalPrice()).subscribe(
      (res)=>{
        this.discountAmount=res.discount;
        this.updateTotalPrice()
        this.giftCardSuccess = "gift card applied";
        let orderDiscount={
          discountAmount:this.discountAmount,
          giftCardCode:this.giftCardCode,
          giftCardSuccess:this.giftCardSuccess
        }
        localStorage.setItem("orderDiscount",JSON.stringify(orderDiscount))
        this.updateTotalPrice();
      },(error)=>{
         this.giftCardError="error while applying gift card"
    })
  }
  
 public updateTotalPrice() {
    this.totalPrice = this.getTotalPrice();
  }
}
