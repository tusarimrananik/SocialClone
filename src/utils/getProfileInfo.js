// Define the getProfileInfo function
const puppeteer = require('puppeteer');
require('dotenv').config();

async function getProfileInfo(url) {
    let infos = {};

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
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
    } catch (error) {
        console.error("Error occurred while setting cookies: ", error);
    }


    await page.goto(url, { waitUntil: 'domcontentloaded' });




    try {
        // Define selectors
        const selectors = {


            nameHeader: 'h1',

            profilePicture: '.x1rg5ohu image',

            coverPhoto: "[data-imgperflogname='profileCoverPhoto']",

            bio: "div > div:nth-child(1) > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div > div.x78zum5.xdt5ytf.x1t2pt76.x1n2onr6.x1ja2u2z.x10cihs4 > div.x78zum5.xdt5ytf.x1t2pt76 > div > div > div.x6s0dn4.x78zum5.xdt5ytf.x193iq5w > div.x9f619.x193iq5w.x1talbiv.x1sltb1f.x3fxtfs.x1swvt13.x1pi30zi.xw7yly9 > div > div.x9f619.x1n2onr6.x1ja2u2z.xeuugli.xs83m0k.xjl7jj.x1xmf6yo.x1emribx.x1e56ztr.x1i64zmx.xnp8db0.x1d1medc.x7ep2pv.x1xzczws > div.x7wzq59 > div > div:nth-child(1) > div > div > div > div > div.xieb3on > div:nth-child(1) > div > div > span",

            friendsCount: ".x193iq5w > a",

            isLockedBadge: 'img.xz74otr[src="/images/wem/private_sharing/lp-badge-large-3x.png"]',

            hasStory: 'div > div > div:nth-child(1) > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div > div.x78zum5.xdt5ytf.x1t2pt76.x1n2onr6.x1ja2u2z.x10cihs4 > div.x78zum5.xdt5ytf.x1t2pt76 > div > div > div:nth-child(1) > div.x9f619.x1ja2u2z.x78zum5.x2lah0s.x1n2onr6.xl56j7k.x1qjc9v5.xozqiw3.x1q0g3np.x1l90r2v.x1ve1bff > div > div > div > div.x15sbx0n.x1xy773u.x390vds.xb2vh1x.x14xzxk9.x18u1y24.xs6kywh.x5wy4b0 > div > div > div > svg > g > circle.x1p5r69i.x17ld789'


        };

        // Wait for all selectors with a single timeout management
        await Promise.all([
            page.waitForSelector(selectors.nameHeader, { timeout: 5000 }).catch(() => null),
            page.waitForSelector(selectors.profilePicture, { timeout: 5000 }).catch(() => null),
            page.waitForSelector(selectors.coverPhoto, { timeout: 5000 }).catch(() => null),
            page.waitForSelector(selectors.bio, { timeout: 5000 }).catch(() => null),
            page.waitForSelector(selectors.friendsCount, { timeout: 5000 }).catch(() => null),
            page.waitForSelector(selectors.isLockedBadge, { timeout: 1000 }).catch(() => null),
            page.waitForSelector(selectors.hasStory, { timeout: 1000 }).catch(() => null)
        ]);

        // Evaluate the page and gather data
        const result = await page.evaluate((selectors) => {
            // Header (name and subName)
            const h1Text = document.querySelector(selectors.nameHeader)?.innerText || '';
            const name = h1Text.trim();

            // Profile picture (second image)
            const profileElements = document.querySelectorAll(selectors.profilePicture);
            const profilePicture = profileElements.length > 1
                ? profileElements[1].getAttributeNS('http://www.w3.org/1999/xlink', 'href')
                : null;

            // Background cover photo
            const coverPhotoElement = document.querySelector(selectors.coverPhoto);
            const backgroundImage = coverPhotoElement ? coverPhotoElement.src : null;

            // Bio
            const bioElement = document.querySelector(selectors.bio);
            const bio = bioElement ? bioElement.innerHTML : null;

            // Friends or Followers count
            const friendsElement = document.querySelector(selectors.friendsCount);
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

            // Locked profile check
            const isLockedElement = document.querySelector(selectors.isLockedBadge);
            const isLocked = !!isLockedElement; // Boolean check



            // Locked profile check
            const hasStoryElement = document.querySelector(selectors.hasStory);
            const hasStory = !!hasStoryElement; // Boolean check

            return { name, profilePicture, backgroundImage, bio, friendsCount, isLocked, hasStory };
        }, selectors);

        // Assign the result to the `infos` object
        infos = {
            name: result.name || null,
            profilePicture: result.profilePicture || null,
            backgroundImage: result.backgroundImage || null,
            bio: result.bio || null,
            friendsCount: result.friendsCount || null,
            isLocked: result.isLocked || null,
            hasStory: result.hasStory || null
        };

    } catch (error) {
        console.log("Error occurred while gathering data: ", error);
    }

    // Return the gathered information
    return infos;

}


// Export the function
module.exports = { getProfileInfo };

















