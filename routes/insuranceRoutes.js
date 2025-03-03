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

const insuranceControllers = require("../controllers/insuranceControllers");

router.post(
  "/add",
  checkJwt,
  checkScopes,
  upload.single("file"),
  insuranceControllers.addInsurance
);

router.get("/", checkJwt, checkScopes, insuranceControllers.getInsurance);

router.delete(
  "/delete",
  checkJwt,
  checkScopes,
  insuranceControllers.deleteInsurance
);

router.put(
  "/edit",
  checkJwt,
  checkScopes,
  upload.single("file"),
  insuranceControllers.editInsurance
);

module.exports = router;
