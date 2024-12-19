# SocialClone

SocialClone is a Node.js application with the following functionalities:

1. **Gmail Profile Picture Scraper**
   - Accepts a Gmail address.
   - Scrapes the Gmail profile picture.
   - Composites the profile picture into an image.
   - Sends the composited image back to the client for download.

2. **Facebook Profile Information Scraper**
   - Accepts a Facebook profile link.
   - Uses Puppeteer to scrape profile information such as:
     - Profile Picture
     - Bio
     - Name
     - Friends
   - Prepares a data snapshot using the scraped information.
   - Takes a screenshot of the prepared data and sends it to the client for download.

## Installation

Follow the steps below to get started with SocialClone:

1. Clone the repository:
   ```bash
   git clone https://github.com/tusarimrananik/SocialClone.git
   ```

2. Navigate to the project folder:
   ```bash
   cd SocialClone
   ```

3. Install dependencies:
   ```bash
   npm ci
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Access the application at `http://localhost:3000`.

## Quick Start with Batch Files

For ease of use, you can use the provided batch files to start and stop the server.

### Setting Up

1. Copy the following files to your desktop (outside of the `SocialClone` folder):
   - `startServer.bat`
   - `stopServer.bat`

2. Ensure that the `SocialClone` folder is located on your desktop.

3. Verify that Node.js is installed on your system.

### Batch File Contents

#### `startServer.bat`
```bat
@echo off
start "SocialClone Server" /min cmd /C "cd /d %USERPROFILE%\Desktop\SocialClone && npm start"
start "Ngrok Server" /min cmd /C "ngrok http --url=humane-newt-formally.ngrok-free.app 3000"
```

#### `stopServer.bat`
```bat
@echo off
taskkill /IM node.exe /F >nul 2>&1
taskkill /IM ngrok.exe /F >nul 2>&1
```

### Usage

- **Start the Server:** Double-click `startServer.bat` to start the SocialClone server and Ngrok.
- **Stop the Server:** Double-click `stopServer.bat` to stop the running processes.

## Features

### Gmail Profile Picture Scraper
- Input a Gmail address.
- Automatically retrieves and composites the profile picture.
- Download the composited image via the client.

### Facebook Profile Information Scraper
- Input a Facebook profile link.
- Scrapes and processes profile data (picture, bio, name, friends).
- Generates a screenshot of the data for download.

## Requirements
- Node.js
- Ngrok (for public URL tunneling)

## Repository
- Clone from [GitHub](https://github.com/tusarimrananik/SocialClone.git)

## Contributions
Contributions, issues, and feature requests are welcome! Feel free to check out the [issues page](https://github.com/tusarimrananik/SocialClone/issues).