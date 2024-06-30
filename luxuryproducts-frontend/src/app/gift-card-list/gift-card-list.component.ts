import { Component, OnInit } from '@angular/core';
import { GiftCardService } from '../services/gift-card.service';
import { GiftCard } from '../models/gift-card.model';

@Component({
    selector: 'app-gift-card-list',
    templateUrl: './gift-card-list.component.html',
    styleUrls: []
})
export class GiftCardListComponent implements OnInit {
    giftCards: GiftCard[];

    constructor(private giftCardService: GiftCardService) { }

    ngOnInit(): void {
        this.giftCardService.getAllGiftCards().subscribe(data => {
            this.giftCards = data;
        });
    }
}
