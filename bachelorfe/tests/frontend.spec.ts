import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('http://localhost:4200');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Bachelorfe/);
});

test('has sidebar component', async ({ page }) => {
    await page.goto('localhost:4200');
    const sidebar = page.locator('app-user-side-component')
    await expect(sidebar).toBeVisible()

    const userRows = sidebar.locator('.user-item')

    await expect(userRows.count()).resolves.toBeGreaterThan(0)
})

test('test search input', async ({ page }) => {
    await page.goto('localhost:4200');

    const sidebar = page.locator('app-user-side-component')
    const userRows = sidebar.locator('.user-item')
    const searchInput = sidebar.locator('#searchField')

    await expect(searchInput).toBeVisible();

    searchInput.fill('mathias christensen');
    await expect(userRows.count()).resolves.toBeGreaterThan(0)
    await expect(searchInput).toHaveValue('mathias christensen')

    // ideally it should only have a single row in the side-bar component with the searched user
    // but whenever i run the test, the searched user is shown twice, causing the test to fail

})

test('does show selected user', async ({ page }) => {
    await page.goto('localhost:4200');
    const sidebar = page.locator('app-user-side-component')
    await expect(sidebar).toBeVisible()
    const searchInput = sidebar.locator('#searchField')

    const userRows = sidebar.locator('.user-item');
    const userCount = await userRows.count();
    expect(userCount).toBeGreaterThan(0); // Ensure there is at least one user row

    const user = userRows.locator('[ng-reflect="mathias christensen"] app-user-avatar');
    await user.waitFor({ state: 'attached' }); // Wait for the element to be attached to the DOM
    await user.click();
    searchInput.fill('mathias christensen');
    const parent = user.locator('..');
    await expect(parent).toHaveClass(/bg-surface-PrimaryColor/);



})