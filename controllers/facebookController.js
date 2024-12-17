const { getProfileInfo } = require('../utils/Facebook/collectFacebookData');
const { setProfileInfo } = require('../utils/Facebook/generateFacebookEditedImage');

let isProcessing = false;

async function fetchAndSetProfileInfo(req, res) {
    if (isProcessing) {
        return res.status(429).json({ error: 'Server is busy. Please try again later.' });
    }

    const submittedUrl = req.body.url;

    if (!submittedUrl) {
        return res.status(400).json({ error: 'URL is required' });
    }

    isProcessing = true;

    try {
        const profileInfo = await getProfileInfo(submittedUrl);
        const imageBuffer = await setProfileInfo(profileInfo);
        const imgSrc = `data:image/png;base64,${Buffer.from(imageBuffer).toString('base64')}`;
        res.json({ imgSrc });
    } catch (error) {
        console.error('Error taking screenshot:', error);
        res.status(500).json({ error: 'Failed to take screenshot' });
    } finally {
        isProcessing = false;
    }
}

module.exports = { fetchAndSetProfileInfo };
