const express = require("express");
const router = express.Router();
const mail = require("../controllers/mail");
router.post("/", mail.sendMail);

module.exports = router;
