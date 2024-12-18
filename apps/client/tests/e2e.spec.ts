import { test, expect } from "@playwright/test";

let email: string;
test.beforeAll(async () => {
  // Initialize the email before any tests run
  email = `testuser_${Date.now()}@example.com`;
});
test.describe("Registration Form", () => {
  // Set up a before each hook to navigate to the registration page
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/register");
  });

  // Test successful registration
  test("should successfully register with valid data", async ({ page }) => {
    // Fill in all required fields

    await page.fill('input[placeholder="Fornavn"]', "Test");
    await page.fill('input[placeholder="Efternavn"]', "User");
    await page.fill('input[placeholder="E-mail"]', email);
    await page.fill('input[placeholder="Adgangskode"]', "StrongPass123!");
    await page.check('input[type="checkbox"][name="acceptedTerms"]');
    await page.check('input[type="checkbox"][name="isSubscribedToNewsletter"]');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/login/);
  });

  // Test validation for required fields
  test("should show validation errors for empty fields", async ({ page }) => {
    // Attempt to submit the form without filling any fields
    await page.click('button[type="submit"]');

    // Check for validation errors
    await expect(page.locator("text=Fornavn er påkrævet")).toBeVisible();
    await expect(page.locator("text=Efternavn er påkrævet")).toBeVisible();
    await expect(page.locator("text=E-mail er påkrævet")).toBeVisible();
    await expect(page.locator("text=Adgangskode er påkrævet")).toBeVisible();
    await expect(
      page.locator("text=Du skal acceptere betingelserne")
    ).toBeVisible();
  });

  // Test password length validation
  test("should show error for short password", async ({ page }) => {
    await page.fill('input[placeholder="Fornavn"]', "Test");
    await page.fill('input[placeholder="Efternavn"]', "User");
    await page.fill('input[placeholder="E-mail"]', email);

    // Enter short password
    await page.fill('input[placeholder="Adgangskode"]', "Short");

    await page.check('input[type="checkbox"][name="acceptedTerms"]');
    await page.click('button[type="submit"]');
    // Check for password length error
    await expect(
      page.locator("text=Adgangskode skal være mindst 8 tegn lang")
    ).toBeVisible();
  });

  // Test terms and conditions validation
  test("should show error when terms are not accepted", async ({ page }) => {
    await page.fill('input[placeholder="Fornavn"]', "Test");
    await page.fill('input[placeholder="Efternavn"]', "User");
    await page.fill('input[placeholder="E-mail"]', email);
    await page.fill('input[placeholder="Adgangskode"]', "StrongPass123!");
    await page.click('button[type="submit"]');
    // Check for terms error
    await expect(
      page.locator("text=Du skal acceptere betingelserne")
    ).toBeVisible();
  });

  // Test name length validation
  test("should show error for short first and last names", async ({ page }) => {
    await page.fill('input[placeholder="Fornavn"]', "A");
    await page.fill('input[placeholder="Efternavn"]', "B");
    await page.fill('input[placeholder="E-mail"]', email);
    await page.fill('input[placeholder="Adgangskode"]', "StrongPass123!");
    await page.check('input[type="checkbox"][name="acceptedTerms"]');
    await page.click('button[type="submit"]');

    // Check for name length errors
    await expect(
      page.locator("text=Fornavn skal være mindst 2 tegn langt")
    ).toBeVisible();
    await expect(
      page.locator("text=Efternavn skal være mindst 2 tegn langt")
    ).toBeVisible();
  });
});
test.describe("Login Form", () => {
  // Set up a beforeEach hook to navigate to the login page
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/login");
  });


  // Test validation errors for empty fields
  test("should show validation errors for empty fields", async ({ page }) => {
    // Attempt to submit the form without filling any fields
    await page.click('button[type="submit"]');

    // Check for validation error messages
    await expect(page.locator("text=E-mail is required")).toBeVisible();
    await expect(page.locator("text=Password is required")).toBeVisible();
  });

  // Test authentication error for incorrect credentials
  test("should show error for invalid credentials", async ({ page }) => {
    // Enter invalid credentials
    await page.fill('input[placeholder="E-mail"]', "wronguser@example.com");
    await page.fill('input[placeholder="Adgangskode"]', "WrongPass!");

    // Submit the form
    await page.click('button[type="submit"]');

    // Check for authentication error message
    await expect(page.locator("text=Invalid email or password")).toBeVisible();
  });
});
