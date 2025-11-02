const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/book.controller.js");

router.get('/:slugBook', controller.detail);

module.exports = router;