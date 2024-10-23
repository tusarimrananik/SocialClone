// Define the getProfileInfo function
const puppeteer = require('puppeteer');
require('dotenv').config();

async function getProfileInfo(url) {
    console.log('working')
    let infos = {};

    const browser = await puppeteer.launch({
        headless: true, args: ['--start-maximized'],
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
            value: '100006234702363',
            domain: '.facebook.com',
            path: '/',
            httpOnly: true,
            secure: true,
        },
        {
            name: 'xs',
            value: '8%3AYrJGWzpRGYhvug%3A2%3A1729688679%3A-1%3A9584%3A%3AAcX2jdae_xCqIUUA1O22f9QR1d-fe7JKHiheBezulg',
            domain: '.facebook.com',
            path: '/',
            httpOnly: true,
            secure: true,
        },
    ];
    try {
        await page.setCookie(...cookies);
        console.log("Cookies set successfully.");
    } catch (error) {
        console.error("Error occurred while setting cookies: ", error);
    }


    await page.goto(url, { waitUntil: 'domcontentloaded' });



    try {
        // Check for each selector separately with timeout handling
        await page.waitForSelector('h1', { timeout: 5000 }).catch(() => null);
        await page.waitForSelector('.x1rg5ohu image', { timeout: 5000 }).catch(() => null);
        await page.waitForSelector("[data-imgperflogname='profileCoverPhoto']", { timeout: 5000 }).catch(() => null);
        await page.waitForSelector(".x2b8uid span", { timeout: 5000 }).catch(() => null);
        await page.waitForSelector(".x193iq5w > a", { timeout: 5000 }).catch(() => null);
        await page.waitForSelector('img.xz74otr[src="/images/wem/private_sharing/lp-badge-large-3x.png"]', { timeout: 1000 }).catch(() => null);

        // Evaluate the page and gather data
        const result = await page.evaluate(() => {
            // Header (name and subName)
            const h1Text = document.querySelector('h1')?.innerText || '';
            const [name, subName] = h1Text.split(/[\(\)]/).map(text => text.trim());

            // Profile picture (second image)
            const profileElements = document.querySelectorAll('.x1rg5ohu image');
            const profilePicture = profileElements.length > 1
                ? profileElements[1].getAttributeNS('http://www.w3.org/1999/xlink', 'href')
                : null;

            // Background cover photo
            const coverPhotoElement = document.querySelector("[data-imgperflogname='profileCoverPhoto']");
            const backgroundImage = coverPhotoElement ? coverPhotoElement.src : null;

            // Bio
            const bioElement = document.querySelector(".x2b8uid span");
            const bio = bioElement ? bioElement.innerHTML : null;

            // Friends or Followers count
            const friendsElement = document.querySelector(".x193iq5w > a");
            let friendsCount = null;
            if (friendsElement) {
                const str = friendsElement.innerText.toLowerCase();
                const hasFriends = str.includes('friends');
                const hasFollowers = str.includes('follower');
                const count = str.split(' ')[0];

                if (hasFriends || hasFollowers) {
                    friendsCount = {
                        count,
                        type: hasFriends ? 'friends' : 'followers'
                    };
                }
            }
            const isLockedElement = document.querySelector('img.xz74otr[src="/images/wem/private_sharing/lp-badge-large-3x.png"]');
            let isLocked
            if (isLockedElement) {
                isLocked = true;
            } else {
                isLocked = false;

            }


            return { name, subName, profilePicture, backgroundImage, bio, friendsCount, isLocked };
        });

        // Assign the result to the `infos` object
        infos = {
            name: result.name || null,
            subName: result.subName || null,
            profilePicture: result.profilePicture || null,
            backgroundImage: result.backgroundImage || null,
            bio: result.bio || null,
            friendsCount: result.friendsCount || null,
            isLocked: result.isLocked || null
        };

    } catch (error) {
        console.log("Error occurred while gathering data: ", error);
    }

    // Return the gathered information
    return infos;

}


// Export the function
module.exports = { getProfileInfo };
