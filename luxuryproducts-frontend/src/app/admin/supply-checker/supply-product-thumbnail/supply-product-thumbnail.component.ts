import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { Product } from "../../../models/product.model";
import { ProductsService } from "../../../services/products.service";

@Component({
  selector: "app-supply-product-thumbnail",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./supply-product-thumbnail.component.html",
  styleUrl: "./supply-product-thumbnail.component.scss",
})
export class SupplyProductThumbnailComponent {
  constructor(private productsService: ProductsService) {}

  @Input() public product!: Product;
  editMode: boolean = false;

  toggleEdit(): void {
    this.editMode = !this.editMode;
  }

  save(): void {
    this.productsService.updateProductStock(this.product).subscribe({
      next: (response) => {
        console.log("Stock updated successfully:", response);
        this.toggleEdit();
      },
      error: (error) => {
        console.error("Error updating stock:", error);
        alert("Failed to update stock. Please try again.");
      },
    });
  }
}
