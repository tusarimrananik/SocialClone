const scrapeGmail = require('./../collectData/scrapeGmail.js');
const prepareGmailData = require('./../prepareData/prepareGmailData.js');

const fs = require('fs')
const path = require('path');





async function handleGmailApiRequest(req, res) {
    const gmail = req.body.gmail;
    const gatheredGmailProfileImageBuffer = await scrapeGmail(gmail);
    const baseImageBuffer = fs.readFileSync(path.join(__dirname, './../assets/base-image.png'));
    const editedImageBuffer = await prepareGmailData(baseImageBuffer, gatheredGmailProfileImageBuffer, gmail);
    const imgSrc = `data:image/png;base64,${Buffer.from(editedImageBuffer).toString('base64')}`;
    res.json({ imgSrc });

}




// if (isProcessing) {
//     return res.status(429).json({ error: 'Server is busy. Please try again later.' });
// }

// const submittedUrl = req.body.url;

// if (!submittedUrl) {
//     return res.status(400).json({ error: 'URL is required' });
// }

// isProcessing = true; // Set processing lock

// try {
//     const imageBuffer = await fetchAndSetProfileInfo(submittedUrl);
//     const imgSrc = `data:image/png;base64,${Buffer.from(imageBuffer).toString('base64')}`;
//     res.json({ imgSrc });
// } catch (error) {
//     console.error('Error taking screenshot:', error);
//     res.status(500).json({ error: 'Failed to take screenshot' });
// } finally {
//     isProcessing = false; // Release processing lock
// }














module.exports = handleGmailApiRequest;
