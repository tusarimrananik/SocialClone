const puppeteer = require('puppeteer');
const path = require('path');

const filePath = path.join(__dirname, '../../public/facebook_ui/index.html');

async function setProfileInfo(profileData) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--start-maximized']
    });
    const [page] = await browser.pages();

    // Set the viewport to the screen dimensions
    const dimensions = await page.evaluate(() => ({
        width: window.screen.width,
        height: window.screen.height
    }));
    await page.setViewport(dimensions);

    await page.goto(filePath, { waitUntil: 'domcontentloaded' });

    try {
        const screenshot = await setData(profileData, page);
        await browser.close(); // Close the browser after operations
        return screenshot; // Return the screenshot buffer
    } catch (error) {
        console.error('Error occurred:', error.message);
        await browser.close(); // Ensure the browser closes on error
        throw error; // Re-throw the error for handling in app.js
    }
}

async function setData(profileData, page) {
    await page.evaluate((data) => {
        const { name, profilePicture, backgroundImage, bio, friendsCount } = data;
        const profilePicElement = document.querySelector('.profilePhotoImage');
        const displayNameElement = document.querySelector('#name');
        const coverPhotoElement = document.querySelector('.coverPhotoImage');
        const statusPicElement = document.querySelector('#statusPic');
        const mainNameElement = document.querySelector('#mainName');
        const bioElement = document.querySelector('#bio');
        const friendsCountElement = document.querySelector('#friendsNumber');
        const friendsTextElement = document.querySelector('#friendsText');

        // Update display name (first 3 words)
        if (name && displayNameElement) {
            displayNameElement.textContent = name.split(' ').slice(0, 3).join(' ');
        }

        // Update main name
        if (name && mainNameElement) {
            mainNameElement.textContent = name;
        }

        // Update profile picture
        if (profilePicture) {
            if (profilePicElement) {
                profilePicElement.src = profilePicture;
            }
            if (statusPicElement) {
                statusPicElement.src = profilePicture;
            }
        }

        // Update cover photo
        if (backgroundImage && coverPhotoElement) {
            coverPhotoElement.src = backgroundImage;
        }

        // Update bio
        if (bio && bioElement) {
            bioElement.innerHTML = bio;
        }

        // Update friends count
        if (friendsCountElement) {
            if (friendsCount) {
                friendsCountElement.innerText = friendsCount.count;
            } else {
                friendsCountElement.classList.add('hidden');
                friendsTextElement.classList.add('hidden');
            }
        }
    }, profileData);

    console.log("Profile information has been set successfully!");

    // Take a screenshot after setting data
    const screenshotBuffer = await takeScreenshot(page);
    return screenshotBuffer; // Return the screenshot buffer
}

async function takeScreenshot(page) {
    try {

        const element = await page.$('.rootBody');
        const screenshotBuffer = await element.screenshot();
        return screenshotBuffer;
        
    } catch (error) {
        console.error('Error taking screenshot:', error);
        throw error; // Re-throw error for higher-level handling
    }
}

// Export the function
module.exports = { setProfileInfo };
