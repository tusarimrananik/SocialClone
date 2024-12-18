const sharp = require('sharp');

/**
 * Generates an edited image with circular overlays and text, and returns the resulting image as a buffer.
 * @param {Buffer} baseImageBuffer - The buffer of the base image.
 * @param {Buffer} overlayImageBuffer - The buffer of the overlay image.
 * @param {string} email - The email text to be added as an overlay.
 * @returns {Promise<Buffer>} - The buffer of the edited image.
 */
const prepareGmailData = async (baseImageBuffer, overlayImageBuffer, email) => {
    try {
        // Resize the overlay image buffer to increase its size before using it
        const resizedOverlayImageBuffer = await sharp(overlayImageBuffer)
            .resize({ width: 800, height: 800, fit: 'cover', background: { r: 0, g: 0, b: 0, alpha: 0 } }) // Transparent background
            .toBuffer();

        // Helper function to create a circular overlay with a specified size
        const createCircularOverlay = async (overlayBuffer, size) => {
            const { width, height } = await sharp(overlayBuffer).metadata();
            const diameter = Math.min(width, height, size);

            const circleSvg = `<svg width="${diameter}" height="${diameter}">
                <circle cx="${diameter / 2}" cy="${diameter / 2}" r="${diameter / 2}" fill="#ffffff" />
            </svg>`;

            return sharp(overlayBuffer)
                .resize(diameter, diameter, { fit: 'cover', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                .composite([{ input: Buffer.from(circleSvg), blend: 'dest-in' }])
                .toFormat('png') // Ensure output is PNG for transparency
                .toBuffer();
        };

        // Configuration for circular overlays
        const overlayConfigs = [
            { size: 110, top: 270, left: 605, opacity: 1 },
            { size: 25, top: 50, left: 882, opacity: 1 },
            { size: 44, top: 139, left: 870, opacity: 1 }
        ];

        // Generate circular overlays based on the configurations
        const overlayBuffers = await Promise.all(
            overlayConfigs.map(async ({ size, top, left, opacity }) => {
                const circularOverlay = await createCircularOverlay(resizedOverlayImageBuffer, size);
                return { input: circularOverlay, top, left, opacity };
            })
        );

        // Create an SVG for the email text overlay
        const emailTextSvg = `
            <svg width="300" height="100">
                <style>
                    .email-text {
                        font-family: 'Google Sans', Arial, sans-serif;
                        font-size: 18px;
                        font-weight: 500;
                        fill: #1f1f1f;
                    }
                </style>
                <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" class="email-text">${email}</text>
            </svg>`;

        // Composite all elements onto the base image and return the result as a buffer
        const editedImageBuffer = await sharp(baseImageBuffer)
            .composite([
                ...overlayBuffers,
                { input: Buffer.from(emailTextSvg), top: 190, left: 510, blend: 'over' }
            ])
            .toBuffer();

        return editedImageBuffer;
    } catch (error) {
        console.error('Error generating edited image:', error.message);
        throw error;
    }
};

module.exports = prepareGmailData;
