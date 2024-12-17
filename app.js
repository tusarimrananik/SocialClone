// Required modules
const path = require('path');
const express = require('express');

const { fetchAndSetProfileInfo } = require('./controllers/facebookController');
const { processGmailSubmission } = require('./controllers/gmailController');

// Set up Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/submit', fetchAndSetProfileInfo);
app.post('/submitGmail', processGmailSubmission);

// Export app for testing purposes
module.exports = app;
