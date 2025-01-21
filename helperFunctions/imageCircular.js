import sharp from 'sharp';

/**
 * Creates a circular image from an input image buffer.
 * @param {Buffer} image - The input image buffer.
 * @param {number} size - The desired output size (diameter).
 * @returns {Promise<Buffer>} - A promise resolving to the circular PNG buffer.
 */

async function imageCircular(image, size) {
    const { width, height } = await sharp(image).metadata();
    const diameter = Math.min(width, height, size);

    // Create SVG mask
    const circleSvg = `
        <svg width="${diameter}" height="${diameter}" xmlns="http://www.w3.org/2000/svg">
            <circle cx="${diameter / 2}" cy="${diameter / 2}" r="${diameter / 2}" fill="#ffffff" />
        </svg>`;

    // Resize, apply circular mask, and return PNG buffer
    return sharp(image)
        .resize(diameter, diameter, { fit: 'cover', position: 'center' })
        .composite([{ input: Buffer.from(circleSvg), blend: 'dest-in' }]) // Apply circular mask
        .toFormat('png')
        .toBuffer();
}

// Export the function for use in other files
export { imageCircular };