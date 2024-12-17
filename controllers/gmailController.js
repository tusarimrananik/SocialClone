const fs = require('fs');
const getGmailProfilePictureBuffer = require('../utils/Gmail/collectGmailData');
const generateEditedImage = require('../utils/Gmail/generateGmailEditedImage');

let isProcessing = false;

async function processGmailSubmission(req, res) {
    if (isProcessing) {
        return res.status(429).json({ error: 'Server is busy. Please try again later.' });
    }

    const submittedGmail = req.body.gmail;

    if (!submittedGmail) {
        return res.status(400).json({ error: 'Gmail is required' });
    }

    isProcessing = true;

    try {
        const gmailProfilePictureBuffer = await getGmailProfilePictureBuffer(submittedGmail);
        const baseImageBuffer = fs.readFileSync('./utils/assets/base-image.png');
        const imageBuffer = await generateEditedImage(baseImageBuffer, gmailProfilePictureBuffer, submittedGmail);
        const imgSrc = `data:image/png;base64,${Buffer.from(imageBuffer).toString('base64')}`;
        res.json({ imgSrc });
    } catch (error) {
        console.error('Error processing Gmail submission:', error);
        res.status(500).json({ error: 'Failed to process Gmail' });
    } finally {
        isProcessing = false;
    }
}

module.exports = { processGmailSubmission };
