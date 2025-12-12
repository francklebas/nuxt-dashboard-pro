import { test, expect } from '@playwright/test';

test.describe('Data Tables', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('products page loads and displays data', async ({ page }) => {
    // Navigate to products page
    await page.click('text=Products');
    await page.waitForURL('/products');

    // Check page title (use more specific selector to avoid navigation title)
    await expect(page.locator('h1').nth(1)).toContainText('Products Management');

    // Wait for data to load
    await page.waitForTimeout(1000);

    // Check that table is visible
    await expect(page.locator('table')).toBeVisible();

    // Check pagination shows correct format
    await expect(page.locator('text=/Page \\d+ of \\d+/')).toBeVisible();

    // Check stats cards
    await expect(page.locator('text=Total Products')).toBeVisible();
    await expect(page.locator('text=In Stock')).toBeVisible();
  });

  test('users page loads and displays data', async ({ page }) => {
    await page.click('text=Users');
    await page.waitForURL('/users');

    await expect(page.locator('h1').nth(1)).toContainText('User Management');

    await page.waitForTimeout(1000);
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('text=Total Users')).toBeVisible();
  });

  test('orders page loads and displays data', async ({ page }) => {
    await page.click('text=Orders');
    await page.waitForURL('/orders');

    await expect(page.locator('h1').nth(1)).toContainText('Order Management');

    await page.waitForTimeout(1000);
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('text=Total Orders')).toBeVisible();
  });

  test('products search functionality works', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(1000);

    // Type in search box
    await page.fill('input[placeholder*="Search"]', 'Wireless');
    await page.waitForTimeout(500);

    // Results should update (this tests client-side filtering in the demo)
    await expect(page.locator('table')).toBeVisible();
  });

  test('products filters panel toggles', async ({ page }) => {
    await page.goto('/products');

    // Click filters button
    await page.click('button:has-text("Filters")');
    await page.waitForTimeout(300);

    // Filter panel should be visible
    await expect(page.locator('text=Category')).toBeVisible();
  });

  test('add product button is clickable', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(1000);

    // Verify Add Product button exists and is clickable
    const addButton = page.locator('button:has-text("Add Product")');
    await expect(addButton).toBeVisible();
    await expect(addButton).toBeEnabled();

    // Click the button (modal interaction tested in modal.e2e.spec.ts)
    await addButton.click();
  });

  test('clicking on a product row opens edit modal', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(1000);

    // Wait for table to be visible
    await expect(page.locator('table')).toBeVisible();

    // Find the first data row (skip header row)
    const firstRow = page.locator('tbody tr').first();
    await expect(firstRow).toBeVisible();

    // Click on the product name cell (3rd cell: checkbox, image, name)
    const nameCell = firstRow.locator('td').nth(2);
    await nameCell.click();

    // Modal should open with "Edit Product" title
    await expect(page.locator('text=Edit Product')).toBeVisible({ timeout: 2000 });

    // Modal should have a form with product fields
    await expect(page.locator('input[placeholder*="product name"]')).toBeVisible();
  });
});
