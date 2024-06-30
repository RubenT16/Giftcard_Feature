import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, catchError, last, throwError } from "rxjs";
import { environment } from "../../environments/environment";
import { UserReturn } from "../models/user-return.model";
import { OrderLine } from "../models/orderLine.model";
import { ApiResponse } from "../models/response.model";

@Injectable({
  providedIn: "root",
})
export class ReturnService {
  private baseUrl: string = environment.base_url + "/returns";

  constructor(private http: HttpClient) {}

  getAllReturns(): Observable<UserReturn[]> {
    return this.http.get<UserReturn[]>(this.baseUrl);
  }

  createReturn(userReturn: UserReturn): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.baseUrl, userReturn);
  }

  notApproveCondition(orderLine: OrderLine) {
    const params = new HttpParams().set("orderLineId", orderLine.id.toString());
    return this.http.put<any>(this.baseUrl + "/not-approve-condition", null, {
      params: params,
    });
  }

  approveCondition(orderLine: OrderLine) {
    const params = new HttpParams().set("orderLineId", orderLine.id.toString());
    return this.http.put<any>(this.baseUrl + "/approve-condition", null, {
      params: params,
    });
  }
}
