import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { authGuard } from "./auth/auth.guard";
import { LoginComponent } from "./auth/login/login.component";
import { RegisterComponent } from "./auth/register/register.component";
import { ProductsComponent } from "./products/products.component";
import { CartComponent } from "./cart/cart.component";
import { ProductDetailComponent } from "./products/product-detail/product-detail.component";
import { ProfileComponent } from "./profile/profile.component";
import { ProfileUpdateComponent } from "./profile/profile-update/profile-update.component";
import { OrderComponent } from "./order/order.component";
import { PaymentSuccessfulComponent } from "./order/payment-successful/payment-successful.component";
import { OrderHistoryComponent } from "./profile/order-history/order-history.component";
import { AdminComponent } from "./admin/admin.component";
import { AllOrdersComponent } from "./admin/all-orders/all-orders.component";
import { SupplyCheckerComponent } from "./admin/supply-checker/supply-checker.component";
import { InitiateReturnComponent } from "./profile/order-history/initiate-return/initiate-return.component";
import { ReturnSuccessfulComponent } from "./profile/order-history/initiate-return/return-successful/return-successful.component";
import { ReturnsComponent } from "./admin/returns/returns.component";
import { AdminGuard } from "./auth/admin.guard";
import { GiftCardListComponent } from "./gift-card-list/gift-card-list.component";
import { BuyGiftCardComponent } from "./buy-gift-card/buy-gift-card.component";
import { CouponsComponent } from "./admin/coupons/coupons.component";
import { GiftCardsComponent } from "./admin/gift-cards/gift-cards.component";


export const routes: Routes = [
  { path: "admin", component: AdminComponent, canActivate: [AdminGuard] },
  { path: "", component: HomeComponent },
  { path: "auth/login", component: LoginComponent },
  { path: "auth/register", component: RegisterComponent },
  { path: "products", component: ProductsComponent },
  { path: "cart", component: CartComponent },
  { path: "products/:id", component: ProductDetailComponent },
  { path: "profile", component: ProfileComponent, canActivate: [authGuard] },
  {
    path: "profile-update",
    component: ProfileUpdateComponent,
    canActivate: [authGuard],
  },
  { path: "products/:id", component: ProductDetailComponent },
  { path: "order", component: OrderComponent, canActivate: [authGuard] },
  {
    path: "order-history",
    component: OrderHistoryComponent,
    canActivate: [authGuard],
  },
  {
    path: "paymentsuccessful",
    component: PaymentSuccessfulComponent,
    canActivate: [authGuard],
  },
  { path: "orders", component: OrderComponent, canActivate: [authGuard] },
  {
    path: "admin/orders",
    component: AllOrdersComponent,
    canActivate: [AdminGuard],
  },
  {
    path: "admin/supplychecker",
    component: SupplyCheckerComponent,
    canActivate: [AdminGuard],
  },
  { path: "order-history/initiate-return", component: InitiateReturnComponent },
  { path: "return-successful", component: ReturnSuccessfulComponent },
  {
    path: "admin/all-returns",
    component: ReturnsComponent,
    canActivate: [AdminGuard],
  },
  {
    path: "admin/giftcards",
    component: GiftCardsComponent,
    canActivate: [AdminGuard],
  },
  { path: 'gift-cards', component: GiftCardListComponent, canActivate: [authGuard] },
  { path: 'buy-gift-card', component: BuyGiftCardComponent, canActivate: [authGuard] },


  {
    path: "admin/coupons",
    component: CouponsComponent,
    canActivate: [AdminGuard]
  }
];
