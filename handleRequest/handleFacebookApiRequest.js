const scrapeFacebook = require('./../collectData/scrapeFacebook.js');
const prepareFacebookData = require('./../prepareData/prepareFacebookData.js');
const validateFacebookUrlRequest = require('../validators/validateFacebookUrlRequest.js');
const { getServerState, setServerState } = require('../helperFunctions/serverState.js');  // Import server state functions



async function handleFacebookApiRequest(req, res) {
    try {


        // Check if the server is busy
        if (getServerState()) {
            return res.status(503).json({
                error: 'Server is currently busy, please try again later.'
            });
        }

        const facebookProfileUrl = Object.values(req.body)[0];
        const validation = validateFacebookUrlRequest({ url: facebookProfileUrl });
        if (validation.error) {
            return res.status(400).json({
                error: validation.error.details.map((err) => err.message)
            });
        } else {
            setServerState(true);

            const gatheredFacebookInformations = await scrapeFacebook(validation.value.url);
            const screenshotBuffer = await prepareFacebookData(gatheredFacebookInformations);
            const imgSrc = `data:image/png;base64,${Buffer.from(screenshotBuffer).toString('base64')}`;
            setServerState(false);

            res.json({ imgSrc });
            // return res.status(200).json({ "status": "worked" });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error occurred.' });
        setServerState(false);


    }

}

module.exports = handleFacebookApiRequest;
