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

const ticketControllers = require("../controllers/ticketControllers");

router.get("/add", checkJwt, checkScopes, ticketControllers.getTypes);

router.post(
  "/add",
  checkJwt,
  checkJwt,
  upload.single("file"),
  ticketControllers.addTicket
);

module.exports = router;
