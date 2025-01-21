const sharp = require('sharp');
const { imageResizer } = require('./../helperFunctions/imageResizer');
const { imageCircular } = require('./../helperFunctions/imageCircular');
const { svgTextGenerator } = require('./../helperFunctions/svgTextGenerator');
const fs = require('fs').promises;

async function prepareGmailDataWithName(baseImage, profilePic, email, name) {
    try {
        const resizedProfilePic = await imageResizer(profilePic, 800, 800);
        const profile = await imageCircular(resizedProfilePic, 155);
        const emailSvg = Buffer.from(svgTextGenerator({ text: email, fontSize: 33, color: "red" }), 'utf-8');
        const nameSvg = Buffer.from(svgTextGenerator({ text: name, fontSize: 28, color: "green" }), 'utf-8');

        return await sharp(baseImage)
            .composite([
                { input: profile, top: 207, left: 282, blend: 'over' },
                { input: emailSvg, top: 450, left: 100, blend: 'over' },
                { input: nameSvg, top: 0, left: 200, blend: 'over' }
            ])
            .toBuffer();
    } catch (error) {
        console.error('Error processing image:', error);
        throw error;
    }
}

async function processAndSaveImage(baseImagePath, profilePicPath, email, name) {
    try {
        const [baseImage, profilePic] = await Promise.all([
            fs.readFile(baseImagePath),
            fs.readFile(profilePicPath)
        ]);

        const processedImage = await prepareGmailDataWithName(baseImage, profilePic, email, name);

        await fs.writeFile('output.png', processedImage);
        console.log('Image saved as output.png');
    } catch (error) {
        console.error('Error processing and saving image:', error);
    }
}

// Example usage
processAndSaveImage('./../assets/gmailWithName.png', './../assets/profile.png', 'tusarimrananik@gmail.com', 'John Doe');

module.exports = { prepareGmailDataWithName };
