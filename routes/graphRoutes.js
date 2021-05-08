const express = require("express");
const router = express.Router();
const graph = require("../controllers/graph");
router.get("/:userID/:token", graph.getGraphData);
module.exports = router;
