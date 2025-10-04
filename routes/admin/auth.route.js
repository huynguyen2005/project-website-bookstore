const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/auth.controller");

// GET: hiển thị form login
router.get("/login", controller.showLogin);

// POST: xử lý login
router.post("/login", controller.login);

//  GET: hiển thị form đăng ký
router.get("/register", controller.showRegister);

//  POST: xử lý đăng ký
router.post("/register", controller.register);

// GET: hiển thị form quên mật khẩu
router.get("/forgot", controller.showForgot);

// POST: xử lý quên mật khẩu
router.post("/forgot", controller.forgot);

module.exports = router;
