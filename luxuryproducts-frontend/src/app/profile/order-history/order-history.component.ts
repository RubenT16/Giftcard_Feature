import { Component, OnInit } from "@angular/core";
import { OrderService } from "../../services/order.service"; // Pas dit pad aan naar waar je service zich bevindt
// Pas dit pad aan naar waar je model zich bevindt
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { Coupon } from "../../models/coupon.model";

@Component({
  selector: "app-order-history",
  templateUrl: "./order-history.component.html",
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  standalone: true,
  styleUrls: ["./order-history.component.scss"],
})
export class OrderHistoryComponent implements OnInit {
  orders: any[];
  searchedOrders: any[];
  orderIdToSearchFor: string;

  constructor(
    private orderService: OrderService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadOrdersIn();
  }

  loadOrdersIn() {
    this.orderService.getOrdersByCurrentUser().subscribe((orders) => {
      this.orders = orders;
      this.searchedOrders = this.orders;
    });
  }

  searchForOrdersById() {
    this.searchedOrders = [];
    this.searchedOrders = this.orderService.getOrdersById(
      this.orders,
      this.orderIdToSearchFor,
    );
  }

  calculateTotal(orderLines: any[], appliedCoupon: Coupon | null,discountAmount:number): number {
    let total = 0;
    for (const product of orderLines) {
      if (!product.status.includes("Return")) {
        total += product.price * product.amount;
      }
    }

    if (appliedCoupon) {
      if (appliedCoupon.percentage) {
        total -= total * (appliedCoupon.discountAmount / 100);
      } else {
        total -= appliedCoupon.discountAmount;
      }
    }

    if(discountAmount){
      total-=discountAmount;
    }

    return Math.max(total, 0);
  }

  isWithin30Days(dateString: string): boolean {
    const orderDate = new Date(dateString);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thirtyDaysAfterOrder = new Date(orderDate);
    thirtyDaysAfterOrder.setDate(thirtyDaysAfterOrder.getDate() + 30);

    return today <= thirtyDaysAfterOrder;
  }

  initiateReturn(order: any) {
    this.router.navigate(["/order-history/initiate-return"], {
      state: { order: order },
    });
  }
}
