require("dotenv").config();
const admin = require("firebase-admin");
const serviceAccount = require("./itinerax-61ee8-firebase-adminsdk-fbsvc-fd1151917e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();

module.exports = { bucket };
