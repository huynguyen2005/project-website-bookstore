const express = require("express");
const multer = require("multer");
const upload = multer();
const router = express.Router();

const controller = require("../../controllers/admin/blog.controller.js");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware.js");

router.get("/", controller.index);

router.patch("/change-status/:id/:status", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.get("/create", controller.create);

router.post(
    "/create",
    upload.fields([{ name: "thumbnail", maxCount: 1 }]),
    uploadCloud.upload,
    controller.createBlog
);

router.get("/detail/:id", controller.detail);

router.get("/edit/:id", controller.edit);

router.patch(
    "/edit/:id",
    upload.fields([{ name: "thumbnail", maxCount: 1 }]),
    uploadCloud.upload,
    controller.editBlog
);

router.delete("/delete/:id", controller.delete);

module.exports = router;
