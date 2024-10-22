const puppeteer = require('puppeteer');
const sharp = require('sharp');
require('dotenv').config();
(async () => {
    const browser = await puppeteer.launch({
        headless: true
    });
    const [page] = await browser.pages();
    await page.setUserAgent(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    );
    await page.setViewport({ width: 360, height: 717 });

    const { DateTime } = require('luxon');
    const currentTime = DateTime.now().toFormat('HH:mm');
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
    await page.goto(`${process.env.FB_UID}`, { waitUntil: 'domcontentloaded' });
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


#screen-root > div > div:nth-child(2) > div:nth-child(4) > div:nth-child(7){
margin-left:1rem;
}






        `
    });
    // Load your original image (top.png)
    const originalImagePath = './images/topold.png'; // Use your file path here
    // Create an SVG overlay with the current time
    const timeSvg = `
  <svg width="360" height="35">
    <text x="17" y="21" font-size="14" font-weight="bold" fill="#888" font-family="Arial, sans-serif">${currentTime}</text>
  </svg>
`;
    // Composite the time on top of the original image
    sharp(originalImagePath)
        .composite([
            {
                input: Buffer.from(timeSvg), // Dynamic time SVG
                top: 0, // Position it appropriately on the image
                left: 0
            }
        ])
        .png() // Output as PNG
        .toFile('./images/top.png', (err, info) => {
            if (err) throw err;
            console.log('Dynamic time status bar created:', info);
        });


    await page.screenshot({ path: 'screenshot.png' });
    await browser.close();

















    const imageTopPath = './images/top.png';
    const imageMiddlePath = 'screenshot.png';
    const imageBottomPath = './images/bottom.png';
    // Read all the images
    Promise.all([
        sharp(imageTopPath).metadata(),
        sharp(imageMiddlePath).metadata(),
        sharp(imageBottomPath).metadata(),
    ]).then(async ([topMeta, middleMeta, bottomMeta]) => {
        // Calculate the total height and max width for the new image
        const totalHeight = topMeta.height + middleMeta.height + bottomMeta.height;
        const maxWidth = Math.max(topMeta.width, middleMeta.width, bottomMeta.width);
        // Create a blank canvas with the correct width and total height
        const canvas = sharp({
            create: {
                width: maxWidth,
                height: totalHeight,
                channels: 4, // RGBA
                background: { r: 0, g: 0, b: 0, alpha: 0 } // transparent background
            }
        });
        // Composite the three images at the correct positions
        const compositeImage = await canvas
            .composite([
                { input: imageTopPath, top: 0, left: 0 }, // Top image
                { input: imageMiddlePath, top: topMeta.height, left: 0 }, // Middle image
                { input: imageBottomPath, top: topMeta.height + middleMeta.height, left: 0 }, // Bottom image
            ])
            .png() // Save as PNG
            .toFile('merged-image.png');

        console.log('Images merged successfully!');
    }).catch(err => {
        console.error('Error:', err);
    });






















})();
