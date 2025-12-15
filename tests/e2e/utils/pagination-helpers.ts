import { Page, expect } from '@playwright/test';

/**
 * Pagination helper utilities for data table E2E tests
 */

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  showingFrom: number;
  showingTo: number;
  totalResults: number;
}

/**
 * Get all pagination controls for a data table
 */
export function getPaginationControls(page: Page) {
  return {
    firstPageButton: page.getByRole('button', { name: 'First page' }),
    previousButton: page.getByRole('button', { name: 'Previous page' }),
    nextButton: page.getByRole('button', { name: 'Next page' }),
    lastPageButton: page.getByRole('button', { name: 'Last page' }),
    // Select element with page size options
    pageSizeSelect: page.locator('select').last(),
    pageDisplay: page.locator('text=/Page \\d+ of \\d+/'),
    resultsDisplay: page.locator('text=/Showing \\d+ to \\d+ of \\d+ results/'),
  };
}

/**
 * Change the page size in the data table
 */
export async function changePageSize(page: Page, size: number): Promise<void> {
  const controls = getPaginationControls(page);

  // Change the page size
  await controls.pageSizeSelect.selectOption(size.toString());

  // Wait for the API call to complete and table to update
  // This triggers fetchData() in useDataTable which makes an async API call
  // Longer wait needed to ensure pagination info is fully updated
  await page.waitForTimeout(5000);

  // Wait for table rows to be visible after update
  await page.locator('tbody tr').first().waitFor({ state: 'visible', timeout: 5000 });
}

/**
 * Navigate to a specific page using navigation buttons
 */
export async function navigateToPage(
  page: Page,
  action: 'first' | 'previous' | 'next' | 'last'
): Promise<void> {
  const controls = getPaginationControls(page);

  switch (action) {
    case 'first':
      await controls.firstPageButton.click();
      break;
    case 'previous':
      await controls.previousButton.click();
      break;
    case 'next':
      await controls.nextButton.click();
      break;
    case 'last':
      await controls.lastPageButton.click();
      break;
  }

  await page.waitForTimeout(300); // Wait for table to update
}

/**
 * Parse pagination info from the display text
 */
export async function getPaginationInfo(page: Page): Promise<PaginationInfo> {
  const controls = getPaginationControls(page);

  // Wait for table to have data rows (not loading state)
  await page.locator('tbody tr').first().waitFor({ state: 'visible', timeout: 5000 });

  // Wait for pagination displays to be visible
  await controls.pageDisplay.waitFor({ state: 'visible' });
  await controls.resultsDisplay.waitFor({ state: 'visible' });

  // Additional delay to ensure pagination has updated after data load
  await page.waitForTimeout(1000);

  // Parse "Page X of Y"
  const pageText = await controls.pageDisplay.textContent();
  const pageMatch = pageText?.match(/Page (\d+) of (\d+)/);

  // Parse "Showing X to Y of Z results"
  const resultsText = await controls.resultsDisplay.textContent();
  const resultsMatch = resultsText?.match(/Showing (\d+) to (\d+) of (\d+) results/);

  if (!pageMatch || !resultsMatch) {
    throw new Error(`Failed to parse pagination info. Page text: "${pageText}", Results text: "${resultsText}"`);
  }

  return {
    currentPage: parseInt(pageMatch[1], 10),
    totalPages: parseInt(pageMatch[2], 10),
    showingFrom: parseInt(resultsMatch[1], 10),
    showingTo: parseInt(resultsMatch[2], 10),
    totalResults: parseInt(resultsMatch[3], 10),
  };
}

/**
 * Verify button states (enabled/disabled)
 */
export async function verifyButtonStates(
  page: Page,
  expectedStates: {
    first?: boolean;
    previous?: boolean;
    next?: boolean;
    last?: boolean;
  }
): Promise<void> {
  const controls = getPaginationControls(page);

  if (expectedStates.first !== undefined) {
    if (expectedStates.first) {
      await expect(controls.firstPageButton).toBeEnabled();
    } else {
      await expect(controls.firstPageButton).toBeDisabled();
    }
  }

  if (expectedStates.previous !== undefined) {
    if (expectedStates.previous) {
      await expect(controls.previousButton).toBeEnabled();
    } else {
      await expect(controls.previousButton).toBeDisabled();
    }
  }

  if (expectedStates.next !== undefined) {
    if (expectedStates.next) {
      await expect(controls.nextButton).toBeEnabled();
    } else {
      await expect(controls.nextButton).toBeDisabled();
    }
  }

  if (expectedStates.last !== undefined) {
    if (expectedStates.last) {
      await expect(controls.lastPageButton).toBeEnabled();
    } else {
      await expect(controls.lastPageButton).toBeDisabled();
    }
  }
}

/**
 * Get text content from first visible row for comparison
 */
export async function getFirstRowText(page: Page): Promise<string> {
  const firstRow = page.locator('tbody tr').first();
  return await firstRow.textContent() || '';
}

/**
 * Verify pagination display matches expected values
 */
export async function verifyPaginationDisplay(
  page: Page,
  expected: {
    currentPage?: number;
    totalPages?: number;
    showingFrom?: number;
    showingTo?: number;
    totalResults?: number;
  }
): Promise<void> {
  const info = await getPaginationInfo(page);

  if (expected.currentPage !== undefined) {
    expect(info.currentPage).toBe(expected.currentPage);
  }

  if (expected.totalPages !== undefined) {
    expect(info.totalPages).toBe(expected.totalPages);
  }

  if (expected.showingFrom !== undefined) {
    expect(info.showingFrom).toBe(expected.showingFrom);
  }

  if (expected.showingTo !== undefined) {
    expect(info.showingTo).toBe(expected.showingTo);
  }

  if (expected.totalResults !== undefined) {
    expect(info.totalResults).toBe(expected.totalResults);
  }
}
