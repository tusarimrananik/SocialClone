const puppeteer = require('puppeteer');
require('dotenv').config(); // Load environment variables from .env

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const [page] = await browser.pages();

    // Set user agent and viewport for a mobile device

    
    await page.setViewport({ width: 375, height: 677 });

    // Set cookies from environment variables
    const cookies = [
        {
            name: 'c_user',
            value: process.env.FB_COOKIE_C_USER,
            domain: '.facebook.com',
            path: '/',
            httpOnly: true,
            secure: true,
        },
        {
            name: 'xs',
            value: process.env.FB_COOKIE_XS,
            domain: '.facebook.com',
            path: '/',
            httpOnly: true,
            secure: true,
        },
    ];

    // Apply the cookies
    await page.setCookie(...cookies);

    // Navigate to Facebook
    await page.goto(`https://m.facebook.com/${process.env.FB_COOKIE_C_USER}`, { waitUntil: 'domcontentloaded' });

    const profilePictureSelector = 'img'; // Example selector

    // Wait for the profile picture to be loaded
    await page.waitForSelector(profilePictureSelector, { timeout: 10000 }); // 10 seconds timeout


    await new Promise(resolve => setTimeout(resolve, 2000));







    await page.screenshot({ path: 'screenshot.png' }); // Takes a screenshot

    // Interact with the page

    // Optionally close the browser
    await browser.close();
})();
