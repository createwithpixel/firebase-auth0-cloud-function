// index.js
// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

// General config
const config = require('./config');
const serviceAccount = require(config.FIREBASE_KEY);

// App config
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: true }));

// Auth0 middleware
const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${config.AUTH0_DOMAIN}/.well-known/jwks.json`
    }),
    audience: config.AUTH0_API_AUDIENCE,
    issuer: `https://${config.AUTH0_DOMAIN}/`,
    algorithms: ['RS256']
});

app.use(jwtCheck);

// Firebase admin init
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: config.FIREBASE_DB
});

// GET object containing Firebase custom token
app.post('/', (req, res) => {
    // Create UID from authenticated Auth0 user
    const uid = req.user.sub;
    const userData = { email: req.user.email, name: req.user.name };
    // Mint token using Firebase Admin SDK
    admin.auth().createCustomToken(uid)
        .then(customToken => {
            // Update email and displayName
            admin.auth().updateUser(uid, {
                email: req.user.email,
                displayName: req.user.name
            });

            // Response must be an object or Firebase errors
            res.json({ firebaseToken: customToken })
        })
        .catch(err =>
            res.status(500).send({
                message: 'Something went wrong acquiring a Firebase token.',
                error: err
            })
        );
});

// Expose Express API as a single Cloud Function:
exports.auth0 = functions.https.onRequest(app);