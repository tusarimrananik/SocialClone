const sharp = require('sharp');
const { imageResizer } = require('../helperFunctions/imageResizer');
const { imageCircular } = require('../helperFunctions/imageCircular');
const { svgTextGenerator } = require('../helperFunctions/svgTextGenerator');
const { generateCurrentTime } = require('../helperFunctions/generateCurrentTime');

const fs = require('fs').promises;
async function prepareGmailDataWithName(baseImage, profilePic, email, name) {
    try {
        const resizedProfilePic = await imageResizer(profilePic, 800, 800);
        const profile = await imageCircular(resizedProfilePic, 155);
        const nameSvg = Buffer.from(svgTextGenerator({ text: name, fontSize: 55, color: "#ffffff", padding: 10 }), 'utf-8')
        const emailSvg = Buffer.from(svgTextGenerator({ text: email, fontSize: 33, color: "#ffffff", padding: 10 }), 'utf-8')
        const timeSvg = Buffer.from(svgTextGenerator({ text: generateCurrentTime(), fontSize: 30, color: "#ffffff", textAlign: "start" }), 'utf-8');

        // const downArrow = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="20" height="20" fill="#fff" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 298.04"><path fill-rule="nonzero" d="M12.08 70.78c-16.17-16.24-16.09-42.54.15-58.7 16.25-16.17 42.54-16.09 58.71.15L256 197.76 441.06 12.23c16.17-16.24 42.46-16.32 58.71-.15 16.24 16.16 16.32 42.46.15 58.7L285.27 285.96c-16.24 16.17-42.54 16.09-58.7-.15L12.08 70.78z"/></svg>`, 'utf-8')



        const baseImageMetadata = await sharp(baseImage).metadata();
        const profileMetadata = await sharp(profile).metadata();
        const emailSvgMetadata = await sharp(emailSvg).metadata();
        const nameSvgMetadata = await sharp(nameSvg).metadata();
        const profileLeft = Math.round((baseImageMetadata.width - profileMetadata.width) / 2);
        const emailSvgLeft = Math.round((baseImageMetadata.width - emailSvgMetadata.width) / 2);
        const nameSvgLeft = Math.round((baseImageMetadata.width - nameSvgMetadata.width) / 2);


        return await sharp(baseImage)
            .composite([
                { input: profile, top: 207, left: profileLeft, blend: 'over' },
                { input: nameSvg, top: 370, left: nameSvgLeft, blend: 'over' },
                { input: timeSvg, top: 10, left: -5, blend: 'over' },
                { input: emailSvg, top: 450, left: emailSvgLeft, blend: 'over' },


            ])
            .toBuffer();
    } catch (error) {
        console.error('Error processing image:', error);
        throw error;
    }
}

module.exports = { prepareGmailDataWithName };
