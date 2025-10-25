const express = require("express");
const multer = require("multer");
const upload = multer();
const router = express.Router();

const controller = require("../../controllers/admin/category.controller.js");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware.js");

router.get("/", controller.index);

router.patch("/change-status/:id/:status", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.get("/create", controller.create);

router.post("/create",controller.createCategory);

router.delete("/delete/:id", controller.deleteCategory);

router.get("/edit/:id", controller.edit);

router.patch("/edit/:id", controller.editCategory);

router.get("/detail/:id", controller.detail);

module.exports = router;
