const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const filePath = path.resolve(__dirname, './FB_UI/index.html');
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;



const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);  // Create the directory if it doesn't exist
}

app.use(express.json());
app.use(express.static(publicDir));


app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));




app.get('/', (req, res) => {
    res.render('index');
});




app.post('/submit', async (req, res) => {
    const submittedUrl = req.body.url;

    try {
        const imageBuffer = await puppeteerRun(submittedUrl);
        console.log('Buffer length:', imageBuffer.length);
        fs.writeFileSync('screenshot.png', imageBuffer); // Save the image to a file




        // Convert the buffer to a Base64 string
        const imageBase64 = Buffer.from(imageBuffer).toString('base64');
        // console.log(imageBuffer)
        // // console.log(imageBase64)

        console.log(Buffer.isBuffer(imageBuffer)); // Should log 'true'
        // console.log(imageBuffer.toString('base64')); // Log the Base64 encoded string

        const imgSrc = `data:image/png;base64,${imageBase64}`; // Create a data URL

        res.json({ imgSrc }); // Send the data URL as a response








        // Set the response headers for the image
        // res.setHeader('Content-Type', 'image/png');
        // res.send(imageBuffer); // Send the image buffer directly
    } catch (error) {
        console.error('Error taking screenshot:', error);
        res.status(500).json({ error: 'Failed to take screenshot' });
    }
});








app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


async function puppeteerRun(url) {

    const browser = await puppeteer.launch({
        headless: true
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
    await page.goto(`${url}`, { waitUntil: 'domcontentloaded' });

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

    await delay(3000);


    const element = await page.$('.rootBody');

    // Take a screenshot and store it in a buffer
    const screenshotBuffer = await element.screenshot();









    await browser.close();
    return screenshotBuffer;  // Return the image buffer directly
}


