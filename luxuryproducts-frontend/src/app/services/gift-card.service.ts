import { GiftCard } from './../models/gift-card.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})
export class GiftCardService {
    private apiUrl = 'http://localhost:8080/api/giftcards';
    
    constructor(private http: HttpClient) { }

    buyGiftCard(amount: number, email: string): Observable<GiftCard> {
        let params = new HttpParams().set('amount', amount.toString()).set('email', email);
        return this.http.post<GiftCard>(`${this.apiUrl}/buy` ,null, {params });
    }

    redeemGiftCard(code: string, amount: number): Observable<any> {
        let params = new HttpParams();
        if (amount) params = params.set('amount', amount);
        if (code) params = params.set('code', code);
        return this.http.put<any>(`${this.apiUrl}/apply`,null, { params });
    }

    getAllGiftCards(): Observable<GiftCard[]> {
        return this.http.get<GiftCard[]>(this.apiUrl);
    }
    getGiftCardsByUser():Observable<GiftCard[]>{
        return this.http.get<GiftCard[]>(this.apiUrl+"/giftCards/by-user")
    }
    getDiscountAmountAndCode(){
        let discountAmountAndcode=localStorage.getItem("orderDiscount");
        if(discountAmountAndcode) return JSON.parse(discountAmountAndcode)
        else return null;
    }
    updateGiftCard(editedCard:GiftCard):Observable<GiftCard>{
        return this.http.put<any>(this.apiUrl,editedCard); 
    }
}  