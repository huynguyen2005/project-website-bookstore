const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/auth.controller");

// GET: hiển thị form login
router.get("/login", controller.showLogin);
// POST: xử lý login
router.post("/login", controller.login);
router.get("/register", controller.showRegister);
router.post("/register", controller.register);

router.get("/forgot", controller.showForgot);
router.post("/forgot", controller.forgot);

module.exports = router;
