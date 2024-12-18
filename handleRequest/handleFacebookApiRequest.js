const scrapeFacebook = require('./../collectData/scrapeFacebook.js');
const prepareFacebookData = require('./../prepareData/prepareFacebookData.js');
const validateFacebookUrlRequest = require('../validators/validateFacebookUrlRequest.js');





async function handleFacebookApiRequest(req, res) {

    const gmail = Object.values(req.body)[0];

    const validation = validateFacebookUrlRequest(gmail);
    console.log(validation);
    console.log(gmail);

    res.json(validation);



    // const facebookProfileUrl = req.body.facebookProfileUrl;
    // const gatheredFacebookInformations = await scrapeFacebook(facebookProfileUrl);
    // const screenshotBuffer = await prepareFacebookData(gatheredFacebookInformations);
    // const imgSrc = `data:image/png;base64,${Buffer.from(screenshotBuffer).toString('base64')}`;
    // res.json({ imgSrc });





}



module.exports = handleFacebookApiRequest;
