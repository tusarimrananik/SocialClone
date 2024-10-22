const puppeteer = require('puppeteer');
require('dotenv').config(); // Load environment variables from .env




(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const [page] = await browser.pages();

    // Set user agent and viewport for a mobile device
    await page.setUserAgent(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    );

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
    await page.goto(`https://m.facebook.com/${process.env.FB_UID}`, { waitUntil: 'domcontentloaded' });

    const profilePictureSelector = 'img'; // Example selector

    // Wait for the profile picture to be loaded
    await page.waitForSelector(profilePictureSelector, { timeout: 10000 }); // 10 seconds timeout

    await new Promise(resolve => setTimeout(resolve, 2000));


    



    











    await page.addStyleTag({
        content: `
      

body{


    overflow: hidden;
}



.m.fixed-container.bottom{

display: none;
}






        `
    });



    // await page.evaluate(() => {
    //     const statusBar = document.createElement('div');
    //     statusBar.className = 'mobile-status-bar';
    //     statusBar.innerHTML = `
    //       <div class="status-left">
    //         <div class="time">10:45 AM</div>
    //         <div class="network">4G</div>
    //       </div>
    //       <div class="status-right">
    //         <div class="wifi">Wi-Fi</div>
    //         <div class="battery">80%</div>
    //       </div>
    //     `;
    //     document.body.prepend(statusBar);

    // });





























































    await page.screenshot({ path: 'screenshot.png' }); // Takes a screenshot

    
    // await browser.close();
})();
