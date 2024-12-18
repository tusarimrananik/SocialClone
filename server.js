// Required modules
const path = require('path');
const express = require('express');
const cors = require('cors');

const handleFacebookApiRequest = require('./handleRequest/handleFacebookApiRequest');
const handleGmailApiRequest = require('./handleRequest/handleGmailApiRequest');

// Set up Express app
const app = express();
const port = process.env.PORT || 3000;
// let isServerBusy = false;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
// Global error handler for JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError) {
    return res.status(400).json({ error: ['Invalid JSON format.'] });
  }
  next(err); // Pass the error to the next middleware if not a SyntaxError
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.post('/api/facebook', handleFacebookApiRequest);
app.post('/api/gmail', handleGmailApiRequest);


