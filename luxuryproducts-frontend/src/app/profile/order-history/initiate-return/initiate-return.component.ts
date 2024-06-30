import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Order } from "../../../models/order.model";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { UserReturn } from "../../../models/user-return.model";
import { OrderService } from "../../../services/order.service";
import { ReturnService } from "../../../services/return.service";
import { ApiResponse } from "../../../models/response.model";

@Component({
  selector: "app-initiate-return",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./initiate-return.component.html",
  styleUrl: "./initiate-return.component.scss",
})
export class InitiateReturnComponent {
  order: Order;
  userReturn: UserReturn;
  constructor(
    private router: Router,
    private orderService: OrderService,
    private returnService: ReturnService,
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.order = navigation?.extras.state?.["order"];

    if (!this.order) {
      this.router.navigate(["/"]);
    } else {
      this.initializeUserReturn();
    }
  }

  initializeUserReturn() {
    this.userReturn = {
      orderLines: [],
      id: 0,
      name: this.order.name,
      infix: this.order.infix,
      last_name: this.order.last_name,
      returnDate: new Date().toISOString(),
      status: "Pending",
    };
  }

  getNumbers(max: number): number[] {
    return Array(max)
      .fill(0)
      .map((x, i) => i + 1);
  }

  hasReturnableItems(): boolean {
    return this.order.orderLines.some(orderLine => 
      orderLine.amountReturned > 0 && orderLine.reasonForReturn && orderLine.reasonForReturn.trim().length > 0
    );
  }

  submitReturns() {
    for (const orderLine of this.order.orderLines) {
      if (orderLine.amountReturned > 0) {
        this.userReturn.orderLines.push(orderLine);
      }
    }
    console.log(this.userReturn);
    this.returnService.createReturn(this.userReturn).subscribe({
      next: (response : ApiResponse) => {
        console.log("Return processed successfully:", response.response);
        this.router.navigate(["/return-successful"]);
      },
      error: (error) => {
        console.error("Error processing return:", error);
      },
    });
  }
}
