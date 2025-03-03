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

const userControllers = require("../controllers/userControllers");

router.post("/sync", userControllers.syncUsers);
router.put("/profile", checkJwt, checkScopes, userControllers.editUser);

module.exports = router;
