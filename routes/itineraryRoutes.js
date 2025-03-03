require("dotenv").config();
const express = require("express");
const router = express.Router();
const { auth, requiredScopes } = require("express-oauth2-jwt-bearer");

const checkScopes = requiredScopes(["update:user", "read:message"]);

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_BASE_URL,
  tokenSigningAlg: "RS256",
});

const itineraryControllers = require("../controllers/itineraryControllers");

router.get("/", checkJwt, checkScopes, itineraryControllers.getItinerary);
router.get(
  "/archives",
  checkJwt,
  checkScopes,
  itineraryControllers.getArchives
);

router.post(
  "/create",
  checkJwt,
  checkScopes,
  itineraryControllers.createItinerary
);
router.post(
  "/invitation",
  checkJwt,
  checkScopes,
  itineraryControllers.inviteUser
);

router.put(
  "/invitation/response",
  checkJwt,
  checkScopes,
  itineraryControllers.editInvitation
);
router.put(
  "/archive",
  checkJwt,
  checkScopes,
  itineraryControllers.archiveItinerary
);

module.exports = router;
