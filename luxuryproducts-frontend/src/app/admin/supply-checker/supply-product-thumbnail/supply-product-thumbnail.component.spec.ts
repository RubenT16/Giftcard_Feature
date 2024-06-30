import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SupplyProductThumbnailComponent } from "./supply-product-thumbnail.component";

describe("SupplyProductThumbnailComponent", () => {
  let component: SupplyProductThumbnailComponent;
  let fixture: ComponentFixture<SupplyProductThumbnailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplyProductThumbnailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SupplyProductThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
