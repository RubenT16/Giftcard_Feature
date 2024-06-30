import { Component, OnInit } from "@angular/core";
import { ReturnService } from "../../services/return.service";
import { UserReturn } from "../../models/user-return.model";
import { CommonModule } from "@angular/common";
import { OrderLine } from "../../models/orderLine.model";
import { Router } from "@angular/router";

@Component({
  selector: "app-returns",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./returns.component.html",
  styleUrl: "./returns.component.scss",
})
export class ReturnsComponent implements OnInit {
  userReturns: UserReturn[];
  processedUserReturns: UserReturn[];
  notProcessedUserReturns: UserReturn[];
  toDisplayReturns: UserReturn[];

  constructor(
    private returnService: ReturnService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadUserReturnsIn();
  }

  loadUserReturnsIn() {
    this.processedUserReturns = [];
    this.notProcessedUserReturns = [];
    this.returnService.getAllReturns().subscribe((userReturns) => {
      this.userReturns = userReturns;
      for (const userReturn of userReturns) {
        console.log(userReturn);

        if (userReturn.status.includes("Pending")) {
          this.notProcessedUserReturns.push(userReturn);
        } else {
          this.processedUserReturns.push(userReturn);
        }
      }
      this.toDisplayReturns = this.userReturns;
    });
  }

  calculateAmountOfItems(userReturn: UserReturn) {
    let totalAmountOfItems = 0;
    for (const orderLine of userReturn.orderLines) {
      totalAmountOfItems += orderLine.amount;
    }
    return totalAmountOfItems;
  }

  notApproveCondition(orderLine: OrderLine) {
    this.returnService.notApproveCondition(orderLine).subscribe({
      next: (response) => {
        console.log("Condition not approved:", response);
        this.loadUserReturnsIn();
      },
      error: (error) => {
        console.error("Error approving condition:", error);
      },
    });
  }

  approveCondition(orderLine: OrderLine) {
    this.returnService.approveCondition(orderLine).subscribe({
      next: (response) => {
        console.log("Condition approved:", response);
        this.loadUserReturnsIn();
      },
      error: (error) => {
        console.error("Error approving condition:", error);
      },
    });
  }

  onDisplayChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;

    if (value === "processed") {
      this.toDisplayReturns = this.processedUserReturns;
    } else if (value === "notProcessed") {
      this.toDisplayReturns = this.notProcessedUserReturns;
    } else {
      this.toDisplayReturns = this.userReturns;
    }
  }
}
