const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/user.controller");
const userValidate = require("../../validates/client/user.validate");

router.get("/register", controller.register);
router.post("/register", userValidate.registerPost, controller.registerPost);
router.get("/login", controller.login);
router.post("/login", userValidate.loginPost, controller.loginPost);
router.get("/logout", controller.logout);
router.get("/password/forgot", controller.passwordForgot);
router.post("/password/forgot", userValidate.passwordForgotPost, controller.passwordForgotPost);
router.get("/password/otp", controller.otpPassword);
router.post("/password/otp", userValidate.otpPasswordPost, controller.otpPasswordPost);
router.get("/password/reset", controller.resetPassword);
router.post("/password/reset", userValidate.resetPasswordPost, controller.resetPasswordPost);
router.get("/infor", controller.inforUser);

module.exports = router;