const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/user.controller");
const userValidate = require("../../validates/client/user.validate");
const authMiddleware = require("../../middlewares/client/auth.middleware");

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
router.get("/infor", authMiddleware.requireAuth, controller.inforUser);
router.post("/infor", authMiddleware.requireAuth, controller.inforUserPost);
router.get("/order-list", authMiddleware.requireAuth, controller.orderList);
router.get("/order-detail/:orderId", authMiddleware.requireAuth, controller.orderDetail);

module.exports = router;