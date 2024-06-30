interface RegistrationFormData {
  name: string;
  infix: string;
  lastName: string;
  email: string;
  password: string;
  repeatedPassword: string;
}

function fillRegistrationFormAndSubmit(data: RegistrationFormData) {
  const { name, infix, lastName, email, password, repeatedPassword } = data;
  cy.get('[formControlName="name"]').type(name);
  cy.get('[formControlName="infix"]').type(infix);
  cy.get('[formControlName="lastName"]').type(lastName);
  cy.get('[formControlName="email"]').type(email);
  cy.get('[formControlName="password"]').type(password);
  cy.get('[formControlName="repeated_password"]').type(repeatedPassword);
  cy.contains("button", "Sign up").click();
}

describe("Order en inzien als ingelogd", () => {
  beforeEach(() => {
    cy.intercept("POST", "http://localhost:8080/api/auth/register", {
      fixture: "successfullRegisterResponse.json",
    }).as("registerRequest");

    cy.visit("http://localhost:4200");
    cy.contains("a", "Register").click();

    fillRegistrationFormAndSubmit({
      name: "name",
      infix: "infix",
      lastName: "last name",
      email: "validemail@test.com",
      password: "James!!Fraser123",
      repeatedPassword: "James!!Fraser123",
    });
  });

  it("Zou order succesvol moeten plaatsen als er producten in de winkelmand zitten", () => {
    cy.task<string>("generateToken").then((token: string) => {
      window.localStorage.setItem("token", token);

      cy.intercept("GET", "http://localhost:8080/api/products", {
        fixture: "products.json",
      }).as("getProductsRequest");
      cy.intercept("POST", "http://localhost:8080/api/orders", {
        fixture: "orderSuccess.json",
      }).as("placeOrderRequest");
      cy.intercept("GET", "http://localhost:8080/api/orders/myOrders", {
        fixture: "allOrders.json",
      }).as("getAllOrdersRequest");

      cy.contains("a", "Products").click();
      cy.url().should("include", "/products");
      cy.contains("button", "Buy").click();
      cy.contains("button", "Buy").click();
      cy.contains("button", "Buy").click();
      cy.contains("a", "Cart").click();

      cy.url().should("include", "/cart");

      cy.contains("button", "Buy").click();
      cy.get('[formControlName="name"]').type("Name");
      cy.get('[formControlName="infix"]').type("Infix");
      cy.get('[formControlName="lastName"]').type("Last Name");
      cy.get('[formControlName="zipCode"]').type("2408PE");
      cy.get('[formControlName="houseNumber"]').type("24");
      cy.get('[formControlName="notes"]').type("Notes");

      cy.contains("button", "Go To Payment").click();
      cy.contains("button", "Go to my orders").click();

      cy.url().should("include", "/order-history");
    });
  });

  it("Zou geen order moeten kunnen plaatsen als de winkelmand leeg is.", () => {
    cy.task<string>("generateToken").then((token: string) => {
      window.localStorage.setItem("token", token);

      cy.intercept("GET", "http://localhost:8080/api/products", {
        fixture: "products.json",
      }).as("getProductsRequest");
      cy.intercept("POST", "http://localhost:8080/api/orders", {
        fixture: "orderSuccess.json",
      }).as("placeOrderRequest");
      cy.intercept("GET", "http://localhost:8080/api/orders/myOrders", {
        fixture: "allOrders.json",
      }).as("getAllOrdersRequest");

      cy.contains("a", "Products").click();
      cy.url().should("include", "/products");
      cy.contains("a", "Cart").click();
      cy.url().should("include", "/cart");

      cy.contains("button", "Buy").should("be.disabled");

      cy.url().should("not.include", "/payment");
      cy.url().should("not.include", "/order-history");
    });
  });
});

describe("Order en inzien als niet ingelogd", () => {
  beforeEach(() => {
    cy.visit("http://localhost:4200");
  });
  it("Zou geen order moeten kunnen plaatsen als niet ingelogd", () => {
    cy.intercept("GET", "http://localhost:8080/api/products", {
      fixture: "products.json",
    }).as("getProductsRequest");

    cy.contains("a", "Products").click();
    cy.url().should("include", "/products");
    cy.contains("button", "Buy").click();
    cy.contains("button", "Buy").click();
    cy.contains("button", "Buy").click();
    cy.contains("a", "Cart").click();
    cy.url().should("include", "/cart");
    cy.contains("button", "Buy").click();
    cy.url().should("include", "/login");
  });

  it("Order History zou niet moeten bestaan als niet ingelogd", () => {
    cy.contains("a", "Order History").should("not.exist");
  });
});
