import { Component, OnInit } from "@angular/core";
import { CartService } from "../services/cart.service";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Product } from "../models/product.model";
import { Order } from "../models/order.model";
import { CouponService } from "../services/coupon.service";
import { GiftCardService } from '../services/gift-card.service';


@Component({
  selector: "app-order",
  templateUrl: "./order.component.html",
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  styleUrls: ["./order.component.scss"],
})
export class OrderComponent implements OnInit {
  public bestelForm: FormGroup;
  public products_in_cart: Product[];
  public order: Order;
  public giftCardAmount: number;
  public giftCardCode: string;

  constructor(
    private cartService: CartService,
    private router: Router,
    private fb: FormBuilder,
    private couponService: CouponService,
    private giftCardService: GiftCardService
  ) {}

  ngOnInit(): void {
    this.products_in_cart = this.cartService.allProductsInCart();
    this.bestelForm = this.fb.group({
      name: ["", [Validators.required]],
      infix: [""],
      lastName: ["", [Validators.required]],
      zipCode: ["", [Validators.required]],
      houseNumber: ["", [Validators.required, Validators.maxLength(5)]],
      notes: [""],
    });
  }

  public clearCart() {
    this.cartService.clearCart();
  }

  public onSubmit() {
    let orderDiscount =this.giftCardService.getDiscountAmountAndCode()
    const formData = this.bestelForm.value;

    const productIds = [];
    for (const product of this.products_in_cart) {
      for (let i = 0; i < product.amount; i++) {
        productIds.push(product.id);
      }
    }

    const orderDTO = {
      name: formData.name,
      infix: formData.infix,
      last_name: formData.lastName,
      zipcode: formData.zipCode,
      houseNumber: formData.houseNumber,
      notes: formData.notes,
      productIds: productIds,
      couponId: this.couponService.getAppliedCoupon()?.id,
      discountAmount:orderDiscount.discountAmount,
      giftCardCode:orderDiscount.giftCardCode
    };

    console.log(orderDTO);
    

    this.cartService.addOrder(orderDTO).subscribe({
      next: (result) => {
        console.log("Order added successfully:", result);
        this.clearCart();
        localStorage.setItem("orderDiscount","");
        this.couponService.clearCoupons();
        this.router.navigateByUrl("/paymentsuccessful");
      },
      error: (error) => {
        console.error("Failed to add order:", error);
      },
      complete: () => {
        console.log("Subscription completed"); // Optional: if there's something to do on completion
      },
    });
  }
  
}
