const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/user.controller.js");

router.get("/", controller.index);
router.delete("/delete/:id", controller.deleteUser);
router.get("/detail/:id", controller.detail);

module.exports = router;
