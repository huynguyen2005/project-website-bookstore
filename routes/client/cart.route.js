const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/cart.controller");

router.get("/", controller.index);
router.post("/add/:bookId", controller.addPost);
router.get("/delete/:bookId", controller.delete);
router.get("/update/:bookId/:quantity", controller.update);

module.exports = router;