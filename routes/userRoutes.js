const express = require("express");
const router = express.Router();
const user = require("../controllers/user");

router.get("/getUser/:userID/:token", user.getUserInfo);

module.exports = router;
