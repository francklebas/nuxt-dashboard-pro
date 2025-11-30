import { test, expect } from "@playwright/test";

test("homepage loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Dashboard/i);
  await expect(page.getByRole("navigation")).toBeVisible();
});
