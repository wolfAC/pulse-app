/// <reference types="cypress" />

describe("Login", () => {
  it("should log in with valid credentials", () => {
    // Navigate to the login page
    cy.visit("/login");

    // Enter valid username and password
    cy.get("input[name=username]").type("testuser");
    cy.get("input[name=password]").type("testpassword");

    // Submit the form
    cy.get("button[type=submit]").click();

    // Verify successful login (e.g., check for a dashboard element)
    cy.contains("Welcome, testuser").should("be.visible");
  });
});
