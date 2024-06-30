import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { GiftCardService } from '../services/gift-card.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-buy-gift-card',
  templateUrl: './buy-gift-card.component.html',
  styleUrls: ['./buy-gift-card.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ]
})
export class BuyGiftCardComponent {
  giftCardForm: FormGroup;
  message: string | null = null;
  messageType: 'success' | 'error' | null = null;

  constructor(
    private giftCardService: GiftCardService,
    private fb: FormBuilder
  ) {
    this.giftCardForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(10), Validators.max(250)]],
      email: [null, [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.giftCardForm.valid) {
      const { amount, email } = this.giftCardForm.value;
      this.giftCardService.buyGiftCard(amount, email).subscribe(
        response => {
          console.log('Gift card purchased successfully', response);
          this.message = 'Gift card purchased successfully!';
          this.messageType = 'success';
          this.giftCardForm.reset();
        },
        error => {
          console.error('Error purchasing gift card', error);
          this.message = 'Error purchasing gift card. Please try again.';
          this.messageType = 'error';
        }
      );
    }
  }
}