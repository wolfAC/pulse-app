import { sampleUser } from "../../lib/samples";

describe("Onboarding Flow", () => {
  const user = sampleUser[0];

  beforeEach(() => {
    cy.visit("/onboarding");
  });

  it("should complete the full onboarding flow successfully", () => {
    // Step 1: Welcome
    cy.get('[data-cy="onboarding-next-button"]').click();

    // Step 2: Profile
    cy.get('[data-cy="onboarding-name-input"]').type(user.name);
    cy.get('[data-cy="onboarding-email-input"]').type(user.email);
    cy.get('[data-cy="onboarding-pin-input"]').type(user.pin);
    cy.get('[data-cy="onboarding-next-button"]').click();

    // Step 3: Finance
    // Currency is default INR, can be skipped or changed. Let's keep default.
    cy.get('[data-cy="onboarding-next-button"]').click();

    // Step 4: Goals
    user.selectedGoals.forEach(goalId => {
      cy.get(`[data-cy="onboarding-goal-${goalId}"]`).click();
    });
    cy.get('[data-cy="onboarding-next-button"]').click();

    // Step 5: Finish
    cy.get('[data-cy="onboarding-next-button"]').click();

    // Should redirect to dashboard
    cy.url().should("eq", Cypress.config("baseUrl") + "/");
  });

  it("should show validation errors for invalid profile data", () => {
    // Step 1: Welcome
    cy.get('[data-cy="onboarding-next-button"]').click();

    // Step 2: Profile - Leave fields empty
    cy.get('[data-cy="onboarding-next-button"]').click();

    cy.get('[data-cy="onboarding-name-error"]').should("be.visible");
    cy.get('[data-cy="onboarding-email-error"]').should("be.visible");
    cy.get('[data-cy="onboarding-pin-error"]').should("be.visible");

    // Invalid email
    cy.get('[data-cy="onboarding-email-input"]').type("invalid-email");
    cy.get('[data-cy="onboarding-next-button"]').click();
    cy.get('[data-cy="onboarding-email-error"]').should("contain", "valid email address");

    // Invalid PIN (non-numeric)
    cy.get('[data-cy="onboarding-pin-input"]').type("abcdef");
    cy.get('[data-cy="onboarding-next-button"]').click();
    cy.get('[data-cy="onboarding-pin-error"]').should("contain", "only numbers");
  });

  it("should allow navigating back and forth through the flow", () => {
    // Step 1 -> 2
    cy.get('[data-cy="onboarding-next-button"]').click();
    cy.get('[data-cy="onboarding-name-input"]').type(user.name);
    cy.get('[data-cy="onboarding-email-input"]').type(user.email);
    cy.get('[data-cy="onboarding-pin-input"]').type(user.pin);
    cy.get('[data-cy="onboarding-next-button"]').click();

    // Step 2 -> 3
    cy.get('[data-cy="onboarding-back-button"]').click();
    cy.get('[data-cy="onboarding-name-input"]').should("have.value", user.name);
    cy.get('[data-cy="onboarding-next-button"]').click();

    // Step 3 -> 4
    cy.get('[data-cy="onboarding-next-button"]').click();
    cy.get('[data-cy="onboarding-back-button"]').click();
    cy.get('[data-cy="onboarding-next-button"]').click();
  });

  it("should handle optional finance fields and goal selection", () => {
    // Get to Step 3
    cy.get('[data-cy="onboarding-next-button"]').click();
    cy.get('[data-cy="onboarding-name-input"]').type(user.name);
    cy.get('[data-cy="onboarding-email-input"]').type(user.email);
    cy.get('[data-cy="onboarding-pin-input"]').type(user.pin);
    cy.get('[data-cy="onboarding-next-button"]').click();

    // Step 3: Finance
    cy.get('[data-cy="onboarding-income-input"]').type("50000");
    cy.get('[data-cy="onboarding-savings-input"]').type("10000");
    cy.get('[data-cy="onboarding-budget-cat-food"]').click();
    cy.get('[data-cy="onboarding-budget-cat-transport"]').click();
    cy.get('[data-cy="onboarding-next-button"]').click();

    // Step 4: Goals
    cy.get('[data-cy="onboarding-goal-productivity"]').click();
    cy.get('[data-cy="onboarding-goal-productivity"]').click(); // Deselect
    cy.get('[data-cy="onboarding-goal-health"]').click();
    cy.get('[data-cy="onboarding-next-button"]').click();

    // Step 5: Finish
    cy.get('[data-cy="onboarding-next-button"]').click();
    cy.url().should("eq", Cypress.config("baseUrl") + "/");
  });
});
