import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Coupon} from "../../models/coupon.model";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CouponService} from "../../services/coupon.service";
import {CommonModule} from "@angular/common";
import {Modal} from 'bootstrap';
import {OrderService} from "../../services/order.service";
import {Order} from "../../models/order.model";
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-coupons',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss'],
})
export class CouponsComponent implements OnInit {
  coupons: Coupon[];
  searchedCoupons: Coupon[];
  orders: Order[];
  usedCoupons: number[] = [];

  couponCodeToSearchFor: string;
  message: string;

  editCouponForm: FormGroup;
  createCouponForm: FormGroup;

  selectedCoupon: Coupon;

  messageModal: Modal;


  @ViewChild('createCouponModal', { static: false }) createCouponModal: ElementRef;
  constructor(private couponService: CouponService, private orderService: OrderService ,private fb: FormBuilder) {}

  ngOnInit() {
    this.loadAllCouponsIn();
    this.loadAllOrdersIn();
    this.initializeForms();
    this.initializeModals();
  }

  initializeForms() {
    this.editCouponForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      discountAmount: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      usageAmount: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
    });

    this.createCouponForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      discountAmount: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      usageAmount: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      expiryDate: ['', Validators.required],
      active: [true],
      percentage: [false]
    });
  }

  initializeModals() {
    const messageModalElement = document.getElementById('messageModal');
    if (messageModalElement) {
      this.messageModal = new Modal(messageModalElement);
    } else {
      console.error('Could not find element with id "messageModal"');
    }
  }

  loadAllCouponsIn() {
    this.couponService.getCoupons().subscribe((coupons) => {
      this.coupons = coupons.sort((a, b) => b.id - a.id).reverse();
      this.searchedCoupons = this.coupons;
    });
  }

  loadAllOrdersIn() {
    this.orderService.getAllOrders().subscribe((orders: Order[]) => {
      this.orders = orders;
      this.usedCoupons = orders
          .filter(order => order.appliedCoupon !== null)
          .map(order => order.appliedCoupon!.id);
    });
  }

  isCouponUsed(couponId: number): boolean {
    return this.usedCoupons.includes(couponId);
  }

  editCoupon(coupon: Coupon) {
    const originalCoupon = JSON.parse(JSON.stringify(coupon)); // Deep copy van originele coupon

    this.editCouponForm.setValue({
      code: coupon.code,
      discountAmount: coupon.discountAmount,
      usageAmount: coupon.usageAmount
    });

    if (this.editCouponForm.valid) {
      this.couponService.updateCoupon(coupon).subscribe(updatedCoupon => {
        const index = this.coupons.findIndex(c => c.id === updatedCoupon.id);
        this.coupons[index] = updatedCoupon;
        this.searchedCoupons = this.coupons;
        this.message = 'Coupon updated successfully';
        this.messageModal.show();
        setTimeout(() => this.messageModal.hide(), 3000);
      });
    } else {
      this.message = 'Failed to update coupon, reverting changes.';
      const index = this.coupons.findIndex(c => c.id === originalCoupon.id);
      this.coupons[index] = originalCoupon;
      this.searchedCoupons = this.coupons;
      this.messageModal.show();
      setTimeout(() => {
        this.messageModal.hide();
      }, 3000);
      this.searchedCoupons[index] = originalCoupon;
    }
  }

  createCoupon() {
    if (this.createCouponForm.valid) {
      this.couponService.createCoupon(this.createCouponForm.value).subscribe(newCoupon => {
        this.coupons.push(newCoupon);
        this.searchedCoupons = this.coupons;
        let modal = new bootstrap.Modal(this.createCouponModal.nativeElement, {});
        modal.hide();
      });
    }
  }

  deleteCoupon(coupon: Coupon) {
    this.couponService.deleteCoupon(coupon.id).subscribe(() => {
      this.coupons = this.coupons.filter(c => c !== coupon);
      this.searchedCoupons = this.coupons;
    });
  }

  searchForCouponsByCode() {
    if (this.couponCodeToSearchFor === '') {
      this.searchedCoupons = this.coupons;
    } else {
      this.searchedCoupons = this.coupons.filter(
          coupon => coupon.code.toLowerCase().includes(this.couponCodeToSearchFor.toLowerCase())
      );
    }
  }
}
