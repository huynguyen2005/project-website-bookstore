const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/my-account.controller.js");
const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware.js");

router.get("/", controller.index);
router.get("/edit", controller.edit);
router.patch("/edit", 
    upload.fields([
        { name: "thumbnail", maxCount: 1 }
    ]),
    uploadCloud.upload,
    controller.editInfor
);

module.exports = router;