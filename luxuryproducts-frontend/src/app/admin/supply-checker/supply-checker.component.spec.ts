import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SupplyCheckerComponent } from "./supply-checker.component";

describe("SupplyCheckerComponent", () => {
  let component: SupplyCheckerComponent;
  let fixture: ComponentFixture<SupplyCheckerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplyCheckerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SupplyCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
