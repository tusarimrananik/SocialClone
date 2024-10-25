// Required modules
const path = require('path');
const { getProfileInfo } = require('./utils/getProfileInfo');
const { setProfileInfo } = require('./utils/setProfileInfo');

const express = require('express');
require('dotenv').config(); // Load environment variables

// Set up Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Set view engine
app.set('views', path.join(__dirname, 'views')); // Ensure this path is correct
app.set('view engine', 'ejs');

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.render('index');
});


async function fetchAndSetProfileInfo(url) {
    try {
        // Fetch profile information from the provided URL
        const profileInfo = await getProfileInfo(url);

        // Set profile information and get the screenshot buffer
        const screenshotBuffer = await setProfileInfo(profileInfo);

        return screenshotBuffer;

    } catch (error) {
        console.error('Error fetching or setting profile info:', error);
    }
}

app.post('/submit', async (req, res) => {
    const submittedUrl = req.body.url;

    if (!submittedUrl) {
        return res.status(400).json({ error: 'URL is required' });
    }
    try {
        const imageBuffer = await fetchAndSetProfileInfo(submittedUrl);
        const imgSrc = `data:image/png;base64,${Buffer.from(imageBuffer).toString('base64')}`; // Directly convert buffer to base64
        res.json({ imgSrc });
    } catch (error) {
        console.error('Error taking screenshot:', error);
        res.status(500).json({ error: 'Failed to take screenshot' });
    }
});

