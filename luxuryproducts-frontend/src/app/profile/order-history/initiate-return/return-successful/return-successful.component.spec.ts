import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ReturnSuccessfulComponent } from "./return-successful.component";

describe("ReturnSuccessfulComponent", () => {
  let component: ReturnSuccessfulComponent;
  let fixture: ComponentFixture<ReturnSuccessfulComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnSuccessfulComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReturnSuccessfulComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
