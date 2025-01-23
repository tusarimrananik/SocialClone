const scrapeGmail = require('./../collectData/scrapeGmail.js');
const prepareGmailData = require('./../prepareData/prepareGmailData.js');
const validateGmailRequest = require('../validators/validateGmailRequest.js');
const { getServerState, setServerState } = require('../helperFunctions/serverState.js');
const { prepareGmailDataWithName } = require('../prepareData/prepareGmailDataWithName.js');

const fs = require('fs');
async function handleGmailApiRequest(req, res) {
    try {
        // Check if the server is busy
        if (getServerState()) {
            return res.status(503).json({
                error: ['Server is currently busy, please try again later.']
            });
        }
        const gmail = req.body.gmail.toLowerCase();
        const name = req.body.name;
        const validation = validateGmailRequest({ gmail: gmail });

        if (validation.error) {
            return res.status(400).json({
                error: validation.error.details.map((err) => err.message)
            });
        } else {
            setServerState(true);
            //perform task

            if (name) {
                const gatheredGmailProfilePicture = await scrapeGmail(validation.value.gmail);
                const baseImageBuffer = fs.readFileSync("./assets/gmailWithName.png");

                const screenshotBuffer = await prepareGmailDataWithName(baseImageBuffer, gatheredGmailProfilePicture, validation.value.gmail, name)


                const imgSrc = `data:image/png;base64,${Buffer.from(screenshotBuffer).toString('base64')}`;
                setServerState(false);
                res.json({ imgSrc });
            } else {
                const gatheredGmailProfilePicture = await scrapeGmail(validation.value.gmail);
                const baseImageBuffer = fs.readFileSync("./assets/base-image.png");
                const screenshotBuffer = await prepareGmailData(baseImageBuffer, gatheredGmailProfilePicture, validation.value.gmail);
                const imgSrc = `data:image/png;base64,${Buffer.from(screenshotBuffer).toString('base64')}`;
                setServerState(false);
                res.json({ imgSrc });
            }

        }
    } catch (error) {
        res.status(500).json({ error: [`Oops! Something went wrong on our end. Please try again later. ${error}`] });
        setServerState(false);
    }

}



module.exports = handleGmailApiRequest;
