const express = require("express");
const multer = require("multer");
const upload = multer();
const router = express.Router();

const controller = require("../../controllers/admin/account.controller.js");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware.js");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
  ]),
  uploadCloud.upload,
  controller.createAccount
);

router.delete("/delete/:id", controller.deleteAccount);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
  ]),
  uploadCloud.upload,
  controller.editAccount
);

router.get("/detail/:id", controller.detail);
module.exports = router;
