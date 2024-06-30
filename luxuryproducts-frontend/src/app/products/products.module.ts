import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ProductsComponent } from "./products.component";
import { ProductThumbnailComponent } from "./product-thumbnail/product-thumbnail.component";
import { ProductDetailComponent } from "./product-detail/product-detail.component";

import { FormsModule } from "@angular/forms";
import { SupplyProductThumbnailComponent } from "../admin/supply-checker/supply-product-thumbnail/supply-product-thumbnail.component";

@NgModule({
  declarations: [
    ProductsComponent,
    ProductThumbnailComponent,
    ProductDetailComponent,
  ],
  imports: [CommonModule, RouterModule, FormsModule],
  exports: [ProductsComponent, ProductThumbnailComponent],
})
export class ProductsModule {}
