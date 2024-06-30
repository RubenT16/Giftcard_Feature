import { Component, OnInit } from "@angular/core";
import { ProductsService } from "../../services/products.service";
import { Product } from "../../models/product.model";
import { SupplyProductThumbnailComponent } from "./supply-product-thumbnail/supply-product-thumbnail.component";

@Component({
  selector: "app-supply-checker",
  standalone: true,
  imports: [SupplyProductThumbnailComponent],
  templateUrl: "./supply-checker.component.html",
  styleUrl: "./supply-checker.component.scss",
})
export class SupplyCheckerComponent implements OnInit {
  public products: Product[] = new Array<Product>();

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.productsService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
    });
  }
}
