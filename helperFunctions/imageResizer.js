import sharp from 'sharp';
/**
 * Resize an image to the specified width and height.
 * 
 * @param {Buffer|string} image - The image to resize, either as a Buffer or a file path.
 * @param {number} width - The desired width of the resized image.
 * @param {number} height - The desired height of the resized image.
 * @returns {Promise<Buffer>} - A promise that resolves to the resized image as a Buffer.
 * @throws {Error} - Throws an error if the image resizing fails.
 */
async function imageResizer(image, width, height) {
    if (!image) {
        throw new Error('Image is required');
    }
    if (typeof width !== 'number' || typeof height !== 'number') {
        throw new Error('Width and height must be numbers');
    }

    try {
        return await sharp(image)
            .resize({ width, height, fit: 'cover', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .toBuffer();
    } catch (error) {
        throw new Error(`Failed to resize image: ${error.message}`);
    }
}

export { imageResizer };