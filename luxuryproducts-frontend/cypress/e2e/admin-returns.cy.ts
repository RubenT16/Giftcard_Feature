interface LoginFormData {
  email: string;
  password: string;
}

function fillRegistrationFormAndSend(data: LoginFormData) {
  const { email, password } = data;
  cy.get('[formControlName="email"]').type(email);
  cy.get('[formControlName="password"]').type(password);
  cy.contains("button", "Log").click();
}

describe("Admin panel: All-Orders", () => {
  beforeEach(() => {
    cy.intercept("POST", "http://localhost:8080/api/auth/login", {
      fixture: "successfullRegisterResponse.json",
    }).as("registerRequest");

    cy.visit("http://localhost:4200");
    cy.contains("a", "Login").click();

    fillRegistrationFormAndSend({
      email: "validemail@test.com",
      password: "James!!Fraser123",
    });
  });

  it("Visit all orders tab and see order info", () => {
    cy.task<string>("generateToken").then((token: string) => {
      window.localStorage.setItem("token", token);

      cy.intercept("GET", "http://localhost:8080/api/orders", {
        fixture: "allOrders.json",
      }).as("getAllOrdersRequest");

      cy.contains("a", "Admin").click();
      cy.url().should("include", "/admin");
      cy.contains("Button", "All Orders").click();
      cy.url().should("include", "/admin/orders");

      cy.contains("Product Name: Tom Clancy's Rainbow Six Siege");
      cy.contains("Status: Delivered");
    });
  });

  it("Visit supply-checker tab and change supply of a product", () => {
    cy.task<string>("generateToken").then((token: string) => {
      window.localStorage.setItem("token", token);

      cy.intercept("GET", "http://localhost:8080/api/products", {
        fixture: "products.json",
      }).as("getProductsRequest");
      cy.intercept("PUT", "http://localhost:8080/api/products/4", {
        body: { "Updated product with id": 1 },
      }).as("putProductsRequest");

      cy.contains("a", "Admin").click();
      cy.url().should("include", "/admin");

      cy.contains("Button", "Supply").click();
      cy.url().should("include", "/admin/");
      cy.contains("Stock: ");
      cy.contains("Edit").click();
      cy.get(
        'input[type="number"].form-control.form-control-sm.w-auto.d-inline-block',
      ).type("123");
      cy.contains("Save").click();
      cy.contains("50123");
    });
  });

  it("Visit returns tab and approve the condition of a product", () => {
    cy.task<string>("generateToken").then((token: string) => {
      window.localStorage.setItem("token", token);

      cy.intercept("GET", "http://localhost:8080/api/returns", {
        fixture: "getallreturns.json",
      }).as("getreturnsrequest");
      cy.intercept(
        "PUT",
        "http://localhost:8080/api/returns/approve-condition?orderLineId=*",
        {
          body: { message: "Return processed succesfully" },
        },
      ).as("approveReturnRequest");

      cy.contains("a", "Admin").click();
      cy.url().should("include", "/admin");
      cy.contains("button", "Returns").click();
      cy.intercept("GET", "http://localhost:8080/api/returns", {
        fixture: "returnsAfterApproveOrNotApprove.json",
      }).as("requestAfterJudge");
      cy.contains("✔").click();
      cy.contains("Processed");
    });
  });

  it("Visit returns tab and dont approve the condition of a product", () => {
    cy.task<string>("generateToken").then((token: string) => {
      window.localStorage.setItem("token", token);

      cy.intercept("GET", "http://localhost:8080/api/returns", {
        fixture: "getallreturns.json",
      }).as("getreturnsrequest");
      cy.intercept(
        "PUT",
        "http://localhost:8080/api/returns/not-approve-condition?orderLineId=*",
        {
          body: { message: "Return processed succesfully" },
        },
      ).as("approveReturnRequest");

      cy.contains("a", "Admin").click();
      cy.url().should("include", "/admin");
      cy.contains("button", "Returns").click();
      cy.intercept("GET", "http://localhost:8080/api/returns", {
        fixture: "returnsAfterApproveOrNotApprove.json",
      }).as("requestAfterJudge");
      cy.contains("✘").click();
      cy.contains("Processed");
    });
  });
});
