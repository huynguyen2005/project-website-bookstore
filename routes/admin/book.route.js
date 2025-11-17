const express = require("express");
const multer = require("multer");
const storage = multer.memoryStorage();  
const upload = multer({ storage });
const router = express.Router();

const controller = require("../../controllers/admin/book.controller.js");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware.js");

router.get("/", controller.index);

router.patch("/change-status/:id/:status", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.get("/create", controller.create);

router.post(
    "/create",
    upload.fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "images", maxCount: 10 },
    ]),
    uploadCloud.upload,
    controller.createBook
);

router.delete("/delete/:id", controller.deleteBook);

router.get("/edit/:id", controller.edit);

router.patch(
    "/edit/:id",
    upload.fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "images", maxCount: 10 },
    ]),
    uploadCloud.upload,
    controller.editBook
);


router.get("/detail/:id", controller.detail);

module.exports = router;
