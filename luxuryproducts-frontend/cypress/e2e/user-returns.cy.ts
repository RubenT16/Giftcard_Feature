interface RegistrationFormData {
  name: string;
  infix: string;
  lastName: string;
  email: string;
  password: string;
  repeatedPassword: string;
}

function fillRegistrationForm(data: RegistrationFormData) {
  const { name, infix, lastName, email, password, repeatedPassword } = data;
  cy.get('[formControlName="name"]').type(name);
  cy.get('[formControlName="infix"]').type(infix);
  cy.get('[formControlName="lastName"]').type(lastName);
  cy.get('[formControlName="email"]').type(email);
  cy.get('[formControlName="password"]').type(password);
  cy.get('[formControlName="repeated_password"]').type(repeatedPassword);
  cy.contains("button", "Sign up").click();
}

describe("Retour-request aanvragen", () => {
  beforeEach(() => {
    cy.intercept("POST", "http://localhost:8080/api/auth/register", {
      fixture: "successfullRegisterResponse.json",
    }).as("registerRequest");

    cy.visit("http://localhost:4200");
    cy.contains("a", "Register").click();

    fillRegistrationForm({
      name: "name",
      infix: "infix",
      lastName: "last name",
      email: "validemail@test.com",
      password: "James!!Fraser123",
      repeatedPassword: "James!!Fraser123",
    });
  });

  it("Zou succesvol de retour moeten verzenden als alles klopt", () => {
    cy.task<string>("generateToken").then((token: string) => {
      window.localStorage.setItem("token", token);

      cy.intercept("GET", "http://localhost:8080/api/orders/myOrders", {
        fixture: "allOrders.json",
      }).as("getAllOrdersRequest");
      cy.intercept("POST", "http://localhost:8080/api/returns", {
        fixture: "postReturn.json",
      }).as("postReturnRequest");

      cy.contains("a", "Order History").click();
      cy.url().should("include", "/order-history");
      cy.contains("button", "Initiate").click();
      cy.get(`#returnSelect${0}`).select("1");
      cy.get(`#reasonSelect${0}`).select("Defective");
      cy.contains("button", "Submit").click();
      cy.url().should("include", "/return-succe");
    });
  });

  it("Zou onsuccesvol de retour moeten verzenden als aantal 0 is", () => {
    cy.task<string>("generateToken").then((token: string) => {
      window.localStorage.setItem("token", token);
  
      cy.intercept("GET", "http://localhost:8080/api/orders/myOrders", {
        fixture: "allOrders.json",
      }).as("getAllOrdersRequest");
      cy.intercept("POST", "http://localhost:8080/api/returns", {
        statusCode: 400,
        body: { message: "Invalid return request" },
      }).as("postReturnRequest");
  
      cy.contains("a", "Order History").click();
      cy.url().should("include", "/order-history");
      cy.contains("button", "Initiate").click();
      cy.get(`#returnSelect0`).then(($select) => {
        const quantity = $select.val();
        if (quantity === "0") {
          cy.get("button").contains("Submit Returns").should("be.disabled");
        }
    })
  })
});

it("Zou onsuccesvol de retour moeten verzenden als er geen reden wordt ingevuld", () => {
  cy.task<string>("generateToken").then((token: string) => {
    window.localStorage.setItem("token", token);

    cy.intercept("GET", "http://localhost:8080/api/orders/myOrders", {
      fixture: "allOrders.json",
    }).as("getAllOrdersRequest");
    cy.intercept("POST", "http://localhost:8080/api/returns", {
      statusCode: 400,
      body: { message: "Invalid return request" },
    }).as("postReturnRequest");

    cy.contains("a", "Order History").click();
    cy.url().should("include", "/order-history");
    cy.contains("button", "Initiate").click();
    cy.get(`#returnSelect0`).select('1')
    cy.get(`#reasonSelect0`).then(($select) => {
      const reason = $select.val();
      if (reason === "") {
        cy.get("button").contains("Submit Returns").should("be.disabled");
      }
    })

})
}


);
})