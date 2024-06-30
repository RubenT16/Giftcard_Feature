import { ComponentFixture, TestBed } from "@angular/core/testing";

import { InitiateReturnComponent } from "./initiate-return.component";

describe("InitiateReturnComponent", () => {
  let component: InitiateReturnComponent;
  let fixture: ComponentFixture<InitiateReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitiateReturnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InitiateReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
