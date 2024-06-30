import { Injectable } from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { Coupon } from "../models/coupon.model";

@Injectable({
  providedIn: "root",
})
export class CouponService {
  private baseUrl: string = environment.base_url + "/coupon";

  private appliedCoupon: Coupon | null = null;
  private apiUrl: string = environment.base_url;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.base_url;
  }

  getCoupons(): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(this.baseUrl);
  }

  updateCoupon(coupon: Coupon): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.apiUrl}/coupon/${coupon.id}`, coupon, { headers: headers, responseType: 'text' });
  }

  createCoupon(coupon: Coupon): Observable<Coupon> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Coupon>(this.baseUrl, coupon, { headers: headers });
  }

  deleteCoupon(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  validateCoupon(coupon: Coupon): boolean {
    console.log("coupon: ", coupon);
    const currentDate = new Date();
    const expiryDate = new Date(coupon.expiryDate);
    return coupon.active && coupon.usageAmount > 0 && expiryDate > currentDate;
  }

  public getAppliedCoupon(): Coupon | null {
    return this.appliedCoupon;
  }

  public setAppliedCoupon(coupon: Coupon | null): void {
    this.appliedCoupon = coupon;
  }

  public clearCoupons() {
    this.appliedCoupon = null;
  }
}
