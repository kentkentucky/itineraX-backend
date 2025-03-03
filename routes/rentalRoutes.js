require("dotenv").config();
const express = require("express");
const router = express.Router();
const { auth, requiredScopes } = require("express-oauth2-jwt-bearer");
const multer = require("multer");

const checkScopes = requiredScopes(["update:user", "read:message"]);

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_BASE_URL,
  tokenSigningAlg: "RS256",
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

const rentalControllers = require("../controllers/rentalControllers");

router.post(
  "/add",
  checkJwt,
  checkScopes,
  upload.single("file"),
  rentalControllers.addRental
);

router.get("/", checkJwt, checkScopes, rentalControllers.getRental);

router.delete("/delete", checkJwt, checkScopes, rentalControllers.deleteRental);

router.put(
  "/edit",
  checkJwt,
  checkScopes,
  upload.single("file"),
  rentalControllers.editRental
);

module.exports = router;
