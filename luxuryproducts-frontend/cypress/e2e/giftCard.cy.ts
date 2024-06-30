interface GiftCardFormData {
  balance: number;
  code: string;
  active: boolean;
}

function fillGiftCardFormAndSubmit(data: GiftCardFormData) {
  const { balance, code, active } = data;
  cy.get('#balance').clear().type(balance.toString());
  cy.get('#code').clear().type(code);
  cy.get('#active').select(active ? 'Active' : 'Inactive');
  cy.get('.save-btn').click();
}

describe("Gift Card Management", () => {
  beforeEach(() => {
    cy.task<string>("generateToken").then((token: string) => {
      window.localStorage.setItem("token", token);
    });
    cy.visit("http://localhost:4200/admin/gift-cards");
  });

  it("Should display and edit gift cards", () => {
    cy.intercept("GET", "http://localhost:8080/api/giftcards", {
      fixture: "giftCards.json",
    }).as("getGiftCardsRequest");

    cy.intercept("PUT", "http://localhost:8080/api/giftcards", {
      statusCode: 200,
      body: {
        id: 1,
        code: "NEWCODE123",
        balance: 150,
        active: true
      }
    }).as("updateGiftCardRequest");

    cy.wait("@getGiftCardsRequest");

    cy.get('.gift-card').should('have.length.greaterThan', 0);

    cy.get('.edit-icon').first().click();

    fillGiftCardFormAndSubmit({
      balance: 150,
      code: "NEWCODE123",
      active: true
    });

    cy.wait("@updateGiftCardRequest");

    cy.get('.gift-card').first().within(() => {
      cy.contains("NEWCODE123");
      cy.contains("€150");
      cy.contains("Active");
    });
  });

  it("Should handle empty gift card list", () => {
    cy.intercept("GET", "http://localhost:8080/api/giftcards", {
      body: []
    }).as("getEmptyGiftCardsRequest");

    cy.wait("@getEmptyGiftCardsRequest");

    cy.contains("You have no gift cards.");
  });

  it("Should buy a new gift card", () => {
    cy.intercept("POST", "http://localhost:8080/api/giftcards/buy", {
      statusCode: 200,
      body: {
        id: 2,
        code: "NEWBUY456",
        balance: 100,
        active: true
      }
    }).as("buyGiftCardRequest");

    cy.contains("button", "Buy Gift Card").click();

    cy.get('[formControlName="amount"]').type("100");
    cy.get('[formControlName="email"]').type("recipient@example.com");
    cy.contains("button", "Purchase").click();

    cy.wait("@buyGiftCardRequest");

    cy.get('.gift-card').contains("NEWBUY456");
  });
});