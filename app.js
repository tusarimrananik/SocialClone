const puppeteer = require('puppeteer');
const sharp = require('sharp');
const path = require('path');
const { title } = require('process');
const { info } = require('console');
const filePath = path.resolve(__dirname, './FB_UI/index.html');
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

require('dotenv').config();
(async () => {




    const browser = await puppeteer.launch({
        headless: false, args: ['--start-maximized']
    });

    const [page] = await browser.pages();

    const dimensions = await page.evaluate(() => {
        return {
            width: window.screen.width,
            height: window.screen.height
        };
    });

    await page.setViewport({
        width: dimensions.width,
        height: dimensions.height,
    });




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



    let infos = {}


    await page.waitForSelector('h1');
    const splitText = await page.evaluate(() => {
        const inputText = document.querySelector('h1').innerText;
        return inputText.split(/[\(\)]/).map(text => text.trim()).filter(text => text);
    });

    infos.name = splitText[0]
    infos.subName = splitText[1]



    await page.waitForSelector('.x1rg5ohu image');
    infos.profilePicture = await page.evaluate(() => {
        const elements = document.querySelectorAll('.x1rg5ohu image');
        if (elements[1]) {
            const imageSrc = elements[1].getAttributeNS('http://www.w3.org/1999/xlink', 'href');
            return imageSrc;
        }
        return null;
    });




    await page.waitForSelector("[data-imgperflogname='profileCoverPhoto']");
    infos.backgroundImage = await page.evaluate(() => {
        return document.querySelector("[data-imgperflogname='profileCoverPhoto']").src;
    });




    await page.waitForSelector(".x2b8uid span");
    infos.bio = await page.evaluate(() => {
        return document.querySelector(".x2b8uid span").innerHTML;
    });


    await page.waitForSelector(".x193iq5w > a");
    infos.friendsCount = await page.evaluate(() => {
        let str = document.querySelector(".x193iq5w > a").innerText;
        const hasFriendsOrFollower = str.includes('friends') || str.includes('follower');
        if (!hasFriendsOrFollower) {
            return;
        }
        return str.split(' ')[0];
    });





    console.log(infos)












    await page.goto(`file://${filePath}`, { waitUntil: 'domcontentloaded' });



    await page.evaluate((infos) => {
        const profilePic = document.querySelector('.profilePhotoImage');
        const name = document.querySelector('#name');
        const coverPic = document.querySelector('.coverPhotoImage');
        const statusPic = document.querySelector('#statusPic');
        const mainName = document.querySelector('#mainName');
        const bio = document.querySelector('#bio');
        const friendsNumber = document.querySelector('#friendsNumber');
        const friendsText = document.querySelector('#friendsText');

        if (name) {
            name.textContent = infos.name.split(' ').slice(0, 3).join(' ');
        }
        if (mainName) {
            mainName.textContent = infos.name;
        }
        if (profilePic) {
            profilePic.src = infos.profilePicture;
        }

        if (statusPic) {
            statusPic.src = infos.profilePicture;
        }

        if (coverPic) {
            coverPic.src = infos.backgroundImage;
        }
        if (bio) {
            bio.innerHTML = infos.bio;
        }
        if (friendsNumber && infos.friendsCount) {
            friendsNumber.innerText = infos.friendsCount;
        } else {
            friendsNumber.classList.add("hidden");
            friendsText.classList.add("hidden");

        }

    }, infos);

    // Optionally, wait for the new image to load
    // await page.waitForSelector('img[src="' + newImageSrc + '"]');























    const element = await page.$('.rootBody');
    await delay(3000);
    await element.screenshot({ path: 'div-screenshot.png' });
    // await browser.close();












})();





























//     const profilePictureSelector = 'img'; // Example selector
//     // Wait for the profile picture to be loaded
//     await page.waitForSelector(profilePictureSelector, { timeout: 10000 }); // 10 seconds timeout
//     await new Promise(resolve => setTimeout(resolve, 2000));
//     await page.addStyleTag({
//         content: `
// body{
//     overflow: hidden;
// }
// .m.fixed-container.bottom{
// display: none;
// }


// #screen-root > div > div:nth-child(2) > div:nth-child(4) > div:nth-child(7){
// margin-left:1rem;
// }
//         `
//     });
//     // Load your original image (top.png)
//     const originalImagePath = './images/topold.png'; // Use your file path here
//     // Create an SVG overlay with the current time
//     const timeSvg = `
//   <svg width="360" height="35">
//     <text x="17" y="21" font-size="14" font-weight="bold" fill="#888" font-family="Arial, sans-serif">${currentTime}</text>
//   </svg>
// `;
//     // Composite the time on top of the original image
//     sharp(originalImagePath)
//         .composite([
//             {
//                 input: Buffer.from(timeSvg), // Dynamic time SVG
//                 top: 0, // Position it appropriately on the image
//                 left: 0
//             }
//         ])
//         .png() // Output as PNG
//         .toFile('./images/top.png', (err, info) => {
//             if (err) throw err;
//             console.log('Dynamic time status bar created:', info);
//         });









//     await page.screenshot({ path: 'screenshot.png' });
//     await browser.close();

















// const imageTopPath = './images/top.png';
// const imageMiddlePath = 'screenshot.png';
// const imageBottomPath = './images/bottom.png';
// // Read all the images
// Promise.all([
//     sharp(imageTopPath).metadata(),
//     sharp(imageMiddlePath).metadata(),
//     sharp(imageBottomPath).metadata(),
// ]).then(async ([topMeta, middleMeta, bottomMeta]) => {
//     // Calculate the total height and max width for the new image
//     const totalHeight = topMeta.height + middleMeta.height + bottomMeta.height;
//     const maxWidth = Math.max(topMeta.width, middleMeta.width, bottomMeta.width);
//     // Create a blank canvas with the correct width and total height
//     const canvas = sharp({
//         create: {
//             width: maxWidth,
//             height: totalHeight,
//             channels: 4, // RGBA
//             background: { r: 0, g: 0, b: 0, alpha: 0 } // transparent background
//         }
//     });
//     // Composite the three images at the correct positions
//     const compositeImage = await canvas
//         .composite([
//             { input: imageTopPath, top: 0, left: 0 }, // Top image
//             { input: imageMiddlePath, top: topMeta.height, left: 0 }, // Middle image
//             { input: imageBottomPath, top: topMeta.height + middleMeta.height, left: 0 }, // Bottom image
//         ])
//         .png() // Save as PNG
//         .toFile('merged-image.png');

//     console.log('Images merged successfully!');
// }).catch(err => {
//     console.error('Error:', err);
// });




















