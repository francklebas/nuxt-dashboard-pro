import { test, expect } from "@playwright/test";

test.describe("Pricing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pricing");
  });

  test("pricing page loads correctly", async ({ page }) => {
    await expect(page).toHaveTitle(/Pricing/i);
    await expect(
      page.getByRole("heading", { name: /Dashboard Pro Pricing/i })
    ).toBeVisible();
  });

  test("displays exactly 2 pricing plans", async ({ page }) => {
    // Wait for pricing cards to load - look for the card containers
    const pricingCards = page.locator(
      '.grid .relative:has(h3:text-matches("Community|Commercial", "i"))'
    );

    // Should have exactly 2 plans
    await expect(pricingCards).toHaveCount(2);
  });

  test("displays Community plan with correct details", async ({ page }) => {
    const communitySection = page.locator("text=Community").first();
    await expect(communitySection).toBeVisible();

    // Check for free price - find the card with Community heading and check for $0
    const communityCard = page.locator('div.relative:has(h3:text("Community"))');
    await expect(communityCard.getByText("$0")).toBeVisible();

    // Check that it's for FOSS projects only
    await expect(communityCard.getByText(/FOSS/i)).toBeVisible();

    // Check key features - scope to the community card to avoid duplicates
    await expect(communityCard.getByText(/Full source code access/i)).toBeVisible();
    await expect(communityCard.getByText(/All UI components/i)).toBeVisible();
    await expect(communityCard.getByText(/Lifetime updates/i)).toBeVisible();
  });

  test("displays Commercial plan with correct details", async ({ page }) => {
    const commercialSection = page.locator("text=Commercial").first();
    await expect(commercialSection).toBeVisible();

    // Check for $49 price
    await expect(page.getByText("$49")).toBeVisible();

    // Check key features
    await expect(page.getByText(/Commercial use license/i)).toBeVisible();
    await expect(page.getByText(/Priority email support/i)).toBeVisible();
  });

  test("Commercial plan has 'Recommended' badge", async ({ page }) => {
    // Check for the recommended/popular badge
    await expect(
      page.getByText(/Recommended/i).or(page.getByText(/Most Popular/i))
    ).toBeVisible();
  });

  test("displays footer text about licenses", async ({ page }) => {
    await expect(
      page.getByText(/All licenses include lifetime updates/i)
    ).toBeVisible();
  });

  test("CTA buttons are clickable", async ({ page }) => {
    // Get all CTA buttons
    const buttons = page.getByRole("button", {
      name: /Get Started|Buy License/i,
    });

    await expect(buttons.first()).toBeVisible();
    await expect(buttons.first()).toBeEnabled();
  });

  test("pricing cards are properly laid out", async ({ page }) => {
    // Check responsive grid layout
    const container = page.locator(".grid").filter({ hasText: /Community/ });
    await expect(container).toBeVisible();

    // Should have grid classes for responsive layout
    const containerClasses = await container.getAttribute("class");
    expect(containerClasses).toContain("grid");
  });
});
