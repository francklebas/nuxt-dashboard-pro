import { test, expect } from "@playwright/test";

test.describe("Contact Form Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/form");
    // Wait for hydration
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);
  });

  test("should display form with all fields", async ({ page }) => {
    // Check title
    await expect(page.getByRole("heading", { name: /contact form/i })).toBeVisible();

    // Check all form fields are present
    await expect(page.getByLabel(/first name/i)).toBeVisible();
    await expect(page.getByLabel(/last name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/message/i)).toBeVisible();

    // Check buttons
    await expect(page.getByRole("button", { name: /cancel/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /send message/i })).toBeVisible();
  });

  test("should show validation errors when submitting empty form", async ({ page }) => {
    // Click submit without filling fields
    await page.getByRole("button", { name: /send message/i }).click();
    await page.waitForTimeout(300);

    // Check for error messages
    const errorMessages = page.getByText(/this field is required/i);
    const count = await errorMessages.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should validate email format", async ({ page }) => {
    // Fill in invalid email
    await page.getByLabel(/first name/i).fill("John");
    await page.getByLabel(/last name/i).fill("Doe");
    await page.getByLabel(/email/i).fill("invalid-email");
    await page.getByLabel(/message/i).fill("Test message");

    // Submit form
    await page.getByRole("button", { name: /send message/i }).click();
    await page.waitForTimeout(300);

    // Check for email validation error
    await expect(page.getByText(/please enter a valid email address/i)).toBeVisible();
  });

  test("should submit form successfully with valid data", async ({ page }) => {
    // Fill in all fields
    await page.getByLabel(/first name/i).fill("John");
    await page.getByLabel(/last name/i).fill("Doe");
    await page.getByLabel(/email/i).fill("john.doe@example.com");
    await page.getByLabel(/message/i).fill("This is a test message for the contact form.");

    // Submit form
    await page.getByRole("button", { name: /send message/i }).click();

    // Wait for submission
    await page.waitForTimeout(1500);

    // Check for success message
    await expect(page.getByText(/your message has been sent successfully/i)).toBeVisible();

    // Check that form fields are cleared
    await expect(page.getByLabel(/first name/i)).toHaveValue("");
    await expect(page.getByLabel(/last name/i)).toHaveValue("");
    await expect(page.getByLabel(/email/i)).toHaveValue("");
    await expect(page.getByLabel(/message/i)).toHaveValue("");
  });

  test("should clear form when cancel button is clicked", async ({ page }) => {
    // Fill in fields
    await page.getByLabel(/first name/i).fill("John");
    await page.getByLabel(/last name/i).fill("Doe");
    await page.getByLabel(/email/i).fill("john.doe@example.com");
    await page.getByLabel(/message/i).fill("Test message");

    // Click cancel
    await page.getByRole("button", { name: /cancel/i }).click();
    await page.waitForTimeout(300);

    // Check that fields are cleared
    await expect(page.getByLabel(/first name/i)).toHaveValue("");
    await expect(page.getByLabel(/last name/i)).toHaveValue("");
    await expect(page.getByLabel(/email/i)).toHaveValue("");
    await expect(page.getByLabel(/message/i)).toHaveValue("");
  });

  test("should navigate back to home", async ({ page }) => {
    // Click back link in main content (not navigation)
    await page.getByRole("main").getByRole("link", { name: /welcome/i }).click();
    await page.waitForTimeout(500);

    // Check that we're on the home page
    await expect(page).toHaveURL("/");
  });

  test("should work in dark mode", async ({ page }) => {
    // Toggle to dark mode
    const themeToggle = page.getByRole("button", { name: /toggle theme/i });
    await themeToggle.click();
    await page.waitForTimeout(500);

    // Verify form is still visible and functional
    await expect(page.getByRole("heading", { name: /contact form/i })).toBeVisible();

    // Fill and submit form
    await page.getByLabel(/first name/i).fill("Jane");
    await page.getByLabel(/last name/i).fill("Smith");
    await page.getByLabel(/email/i).fill("jane.smith@example.com");
    await page.getByLabel(/message/i).fill("Testing dark mode");

    await page.getByRole("button", { name: /send message/i }).click();
    await page.waitForTimeout(1500);

    // Check success message
    await expect(page.getByText(/your message has been sent successfully/i)).toBeVisible();
  });

  test("should switch language and display translated content", async ({ page }) => {
    // Switch to French
    await page.getByRole("button", { name: "Français" }).click();
    await page.waitForTimeout(500);

    // Check that French translations are displayed
    await expect(page.getByRole("heading", { name: /formulaire de contact/i })).toBeVisible();
    await expect(page.getByText(/prénom/i).first()).toBeVisible();
    await expect(page.getByText(/nom/i).first()).toBeVisible();

    // Switch back to English
    await page.getByRole("button", { name: "English" }).click();
    await page.waitForTimeout(500);

    // Check English translations
    await expect(page.getByRole("heading", { name: /contact form/i })).toBeVisible();
  });

  test("should show loading state while submitting", async ({ page }) => {
    // Fill in form
    await page.getByLabel(/first name/i).fill("Test");
    await page.getByLabel(/last name/i).fill("User");
    await page.getByLabel(/email/i).fill("test@example.com");
    await page.getByLabel(/message/i).fill("Test");

    // Submit and check for loading spinner
    const submitButton = page.getByRole("button", { name: /send message/i });
    await submitButton.click();

    // Check that button is disabled during submission
    await expect(submitButton).toBeDisabled();

    // Wait for completion
    await page.waitForTimeout(1500);

    // Button should be enabled again
    await expect(submitButton).toBeEnabled();
  });
});
