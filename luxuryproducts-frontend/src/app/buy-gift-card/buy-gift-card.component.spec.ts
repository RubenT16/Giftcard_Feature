import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyGiftCardComponent } from './buy-gift-card.component';

describe('BuyGiftCardComponent', () => {
  let component: BuyGiftCardComponent;
  let fixture: ComponentFixture<BuyGiftCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyGiftCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuyGiftCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
