# SocialClone

SocialClone is a Node.js application that provides the following functionalities:

## Features

### 1. Gmail Profile Picture Scraper
- Accepts a Gmail address.
- Scrapes the Gmail profile picture.
- Composites the profile picture into an image.
- Sends the composited image back to the client for download.

### 2. Facebook Profile Information Scraper
- Accepts a Facebook profile link.
- Uses Puppeteer to scrape profile information, including:
  - Profile Picture
  - Bio
  - Name
  - Friends
- Prepares a data snapshot using the scraped information.
- Captures a screenshot of the prepared data and sends it to the client for download.

---

## Installation

Follow these steps to set up and run SocialClone:

### Prerequisites
- [Node.js](https://nodejs.org/)
- [Ngrok](https://ngrok.com/)

### Steps

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/tusarimrananik/SocialClone.git
   ```

2. **Navigate to the Project Folder:**
   ```bash
   cd SocialClone
   ```

3. **Install Dependencies:**
   ```bash
   npm ci
   ```

4. **Set Up Ngrok:**
   - Obtain your Ngrok secret key from the Ngrok dashboard.
   - Set the secret key using the following command:
     ```bash
     ngrok config add-authtoken YOUR_NGROK_SECRET_KEY
     ```
   - Add the Ngrok executable path to your system's environment variables:
     1. Open the Start Menu and search for "Environment Variables."
     2. Select "Edit the system environment variables."
     3. Click "Environment Variables."
     4. Under "System Variables," select "Path" and click "Edit."
     5. Add the path to your Ngrok executable and click "OK."

5. **Start the Server:**
   ```bash
   npm start
   ```

6. **Access the Application:**
   Navigate to `http://localhost:3000` in your browser.

7. **Setup Gmail Integration:**
   Run the following command in Windows Command Prompt to manually log in to a Google account:
   ```bash
   "C:\Program Files\Google\Chrome\Application\chrome.exe" --user-data-dir="C:\Puppeteer\Profile"
   ```

8. **Test the Gmail API Endpoint:**
   Use a sample Gmail address to test the Gmail scraper. A new Puppeteer profile will be created automatically.

---

## Quick Start with Batch Files

Simplify starting and stopping the server using batch files:

### Setup Batch Files

1. Copy the following files to your desktop (outside the `SocialClone` folder):
   - `startServer.bat`
   - `stopServer.bat`

2. Ensure that the `SocialClone` folder is located on your desktop.

### Batch File Contents

#### `startServer.bat`
```bat
@echo off
start "SocialClone Server" /min cmd /C "cd /d %USERPROFILE%\Desktop\SocialClone && npm start"
start "Ngrok Server" /min cmd /C "ngrok http 3000"
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

---

## Requirements

- Node.js
- Ngrok (for public URL tunneling)

---

## Repository

Clone the repository from [GitHub](https://github.com/tusarimrananik/SocialClone.git).

---

## Contributions

Contributions, issues, and feature requests are welcome! Feel free to check out the [issues page](https://github.com/tusarimrananik/SocialClone/issues).