import { Component, OnInit } from "@angular/core";
import { Product } from "../models/product.model";
import { UserService } from "../services/user.service";
import { User } from "../models/user.model";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { GiftCardService } from "../services/gift-card.service";
import { GiftCard } from "../models/gift-card.model";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.scss",
})
export class ProfileComponent implements OnInit {
  public user: User;
  public giftCards:GiftCard[]
  public showGiftCards: boolean = false;

  constructor(private userService: UserService,private giftCardService:GiftCardService) {}

  ngOnInit(): void {
    this.userService.getUserByEmail().subscribe((user: User) => {
      this.user = user;
    });
    this.giftCardService.getGiftCardsByUser().subscribe((res)=>{
      this.giftCards=res
    })
  }
  toggleGiftCards(): void {
    this.showGiftCards = !this.showGiftCards;
  }
}
