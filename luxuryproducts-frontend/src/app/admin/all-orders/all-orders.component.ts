import { Component, OnInit } from "@angular/core";
import { OrderService } from "../../services/order.service";
import { OrderHistoryComponent } from "../../profile/order-history/order-history.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule, CurrencyPipe } from "@angular/common";

@Component({
  selector: "app-all-orders",
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: "./all-orders.component.html",
  styleUrl: "./all-orders.component.scss",
})
export class AllOrdersComponent implements OnInit {
  orders: any[];
  searchedOrders: any[];
  orderIdToSearchFor: string;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadAllOrdersIn();
  }

  loadAllOrdersIn() {
    this.orderService.getAllOrders().subscribe((orders) => {
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

  calculateTotal(products: any[]): number {
    let total = 0;
    for (const product of products) {
      if (!product.status.includes("Return")) {
        total += product.price * product.amount;
      }
    }
    return total;
  }
}
