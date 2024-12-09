const express = require("express");
const router = express.Router();
const { deploy, getDeploy } = require("../controllers/deploy");

// Route for deployment
router.get("/deploy", deploy);

// Route for retrieving deployed files
router.get("/deploy/:uuid", getDeploy);

module.exports = router;
