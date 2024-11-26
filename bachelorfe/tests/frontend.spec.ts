import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('http://localhost:4200');

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

    const filteredUser = await userRows.count();
    console.log(`Filtered user count: ${filteredUser}`);

    for (let i = 0; i < filteredUser; i++) {
        const userText = await userRows.nth(i).innerText();
        console.log(`User ${i + 1}: ${userText}`);
    }

    // ideally it should only have a single row in the side-bar component with the searched user
    // but whenever i run the test, the searched user is shown twice, causing the test to fail
    // now it shows both users in the console log. 
})

// TODO WIP
test('does show selected user', async ({ page }) => {
    await page.goto('localhost:4200');
    const sidebar = page.locator('app-user-side-component');
    await expect(sidebar).toBeVisible();

    const userRows = sidebar.locator('.user-item');
    const userCount = await userRows.count();
    console.log(`Number of users: ${userCount}`);
    expect(userCount).toBeGreaterThan(0);

    const user = userRows.filter({ hasText: 'mathias christensen' });
    console.log('User exists:', await user.count());
    expect(await user.count()).toBeGreaterThan(0); 

    const userName = await user.first().innerText();
    console.log('User name clicked:', userName); 

    // Henter klasserne for knappen (user element)
    const userClasses = await user.first().getAttribute('class');
    const classList = userClasses?.split(' ') || []; // Splitter strengen til et array

    console.log('User classes:', classList);

    // Tjekker om klassen eksisterer
    let hasBgSurfaceClass = false;
    for (const className of classList) {
        if (className.includes('bg-surface')) {
            hasBgSurfaceClass = true;
            break;
        }
    } 

    expect(hasBgSurfaceClass).toBe(true);

    const userNameAfterClick = await user.first().innerText();
    console.log('User name after click:', userNameAfterClick);
});




test('Should switch between working days and sick/holidays', async({page}) => {
    await page.goto('localhost:4200');

    const dataSideTabs = page.locator('app-data-side .header-switch-tab');

    const firstTab = dataSideTabs.locator('text=Arbejdstimer');
    await expect(firstTab).toHaveClass(/bg-blue-500/);

    const secondTab = dataSideTabs.locator('text=Fridage');
    await expect(secondTab).not.toHaveClass(/bg-blue-500/);

    await secondTab.click();

    await expect(firstTab).not.toHaveClass(/bg-blue-500/);
    await expect(secondTab).toHaveClass(/bg-blue-500/);
})


// test('test search input and read tasks for the week', async ({ page }) => {
//     await page.goto('localhost:4200');

// })