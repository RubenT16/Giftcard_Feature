import { Component, OnInit } from '@angular/core';
import { GiftCardService } from '../../services/gift-card.service';
import { GiftCard } from '../../models/gift-card.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gift-cards',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gift-cards.component.html',
  styleUrl: './gift-cards.component.scss'
})
export class GiftCardsComponent implements OnInit {
  public giftCards: GiftCard[] = [];
  public editingCard: GiftCard | null = null;

  constructor(private giftCardService: GiftCardService) {}

  ngOnInit(): void {
    this.loadGiftCards();
  }

  loadGiftCards(): void {
    this.giftCardService.getAllGiftCards().subscribe((res) => {
      this.giftCards = res;
    });
  }

  startEditing(card: GiftCard): void {
    this.editingCard = { ...card };
  }

  cancelEditing(): void {
    this.editingCard = null;
  }

  saveCard(): void {
    if (this.editingCard) {
      this.giftCardService.updateGiftCard(this.editingCard).subscribe(
        (updatedCard) => {
          const index = this.giftCards.findIndex(c => c.id === updatedCard.id);
          if (index !== -1) {
            this.giftCards[index] = updatedCard;
          }
          this.editingCard = null;
        },
        (error) => {
          console.error('Error updating gift card:', error);
        }
      );
      console.log(this.editingCard)
    }
  }
}