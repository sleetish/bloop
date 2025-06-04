const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    const appHtmlPath = path.join(__dirname, 'app.html');
    fs.readFile(appHtmlPath, 'utf8', (err, htmlContent) => {
        if (err) {
            console.error("Error reading app.html:", err);
            return res.status(500).send("Error loading application HTML.");
        }

        // Retrieve Firebase config and App ID from environment variables
        // Default FIREBASE_CONFIG to 'null' (as a string) to ensure valid JSON for client-side parsing
        const firebaseConf = process.env.FIREBASE_CONFIG || 'null';
        // Default APP_ID to a specific string if not set
        const appIdVal = process.env.APP_ID || 'missing-app-id-from-server';

        if (!process.env.FIREBASE_CONFIG) {
            console.warn("Warning: FIREBASE_CONFIG environment variable is not set. Using 'null' as default.");
        }
        if (!process.env.APP_ID) {
            console.warn("Warning: APP_ID environment variable is not set. Using 'missing-app-id-from-server' as default.");
        }

        // Replace placeholders
        let modifiedHtml = htmlContent.replace('__FIREBASE_CONFIG_PLACEHOLDER__', firebaseConf);
        modifiedHtml = modifiedHtml.replace('__APP_ID_PLACEHOLDER__', appIdVal);

        res.send(modifiedHtml);
    });
});

// Serve static assets from the current directory (optional, but useful for CSS/JS if any are separate)
// For this project, app.html is self-contained with CDN links, but this is good practice.
// app.use(express.static(__dirname));

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log(`Access the app at http://localhost:${PORT}`);
    if (!process.env.FIREBASE_CONFIG || !process.env.APP_ID) {
        console.warn("--------------------------------------------------------------------------------------");
        console.warn("WARNING: FIREBASE_CONFIG or APP_ID environment variables are not set.");
        console.warn("The application will run in a degraded mode (Firebase will likely show an error client-side).");
        console.warn("To fully test Firebase integration, set these environment variables before starting the server.");
        console.warn("Example: FIREBASE_CONFIG='{\"apiKey\": \"...\", ...}' APP_ID='my-app' node server.js");
        console.warn("--------------------------------------------------------------------------------------");
    }
});
