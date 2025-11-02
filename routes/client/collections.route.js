const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/collections.controller.js");

router.get("/:slugCategory", controller.index);

module.exports = router;