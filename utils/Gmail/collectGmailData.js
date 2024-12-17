const puppeteer = require('puppeteer');
const axios = require('axios');
const sharp = require('sharp');

const getGmailProfilePictureBuffer = async (gmail) => {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            userDataDir: 'C:\\Puppeteer\\Profile',
            args: ['--no-sandbox', '--disable-setuid-sandbox']

        });

        const [page] = await browser.pages();
        await page.setUserAgent('Mozilla/5.0 (Linux; Android 10; Mobile; rv:89.0) Gecko/89.0 Firefox/89.0');

        const { width, height } = await page.evaluate(() => ({
            width: window.screen.width,
            height: window.screen.height
        }));
        await page.setViewport({ width, height });
        await page.goto('https://mail.google.com/mail/mu/mp/938/#tl/priority/%5Eio_im', { waitUntil: 'networkidle2' });
        await page.waitForSelector(".kYbzg.pNR6wf.laQMJf.AXeQ0c.YaxK2.leetlb.LTRkrd");
        await page.click(".kYbzg.pNR6wf.laQMJf.AXeQ0c.YaxK2.leetlb.LTRkrd");
        await page.waitForSelector("#composeto");
        await page.focus("#composeto");
        await page.type("#composeto", `${gmail}\n`)
        const imgeSelector = "img.pSeF4d.iP1Jkc.Rqt9Te";
        const alphabetSelector = "div.RtfF2c > :first-child";

        const createImageWithAlphabet = async (alphabet) => {
            const width = 500;
            const height = 500;

            // Create a blank image buffer with the background color
            const svgImage = `
                <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#EC407A"/>
                    <text x="50%" y="50%" font-size="200px" font-family="Arial" font-weight="bold" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">
                        ${alphabet}
                    </text>
                </svg>
            `;

            // Use sharp to convert the SVG to PNG
            const buffer = await sharp(Buffer.from(svgImage))
                .png()
                .toBuffer();

            return buffer;
        };

        const getImageBuffer = async (page, imgSelector, alphabetSelector) => {
            try {
                await page.waitForSelector(imgSelector, { timeout: 5000 });
                const imageSrc = await page.$eval(imgSelector, img => img.src);
                const response = await axios.get(imageSrc, { responseType: 'arraybuffer' });
                console.log("working on try")

                return Buffer.from(response.data, 'binary');

            } catch (error1) {
                try {
                    await page.waitForSelector(alphabetSelector, { timeout: 5000 });
                    console.log("alphabet selector found!!")
                    const textContent = await page.$eval(alphabetSelector, element => element.textContent);
                    console.log(textContent);
                    const imageBuffer = await createImageWithAlphabet(textContent);
                    console.log("worked on catch 1")

                    return imageBuffer;
                } catch (error2) {
                    throw new Error('Neither image selector nor alphabet selector was found.');
                }
            }
        };

        const finalImage = await getImageBuffer(page, imgeSelector, alphabetSelector);
        return finalImage;


    } catch (error) {
        console.error('Failed to retrieve Gmail profile picture:', error.message);
        return null;
    } finally {
        if (browser) await browser.close();
    }
};

module.exports = getGmailProfilePictureBuffer;
