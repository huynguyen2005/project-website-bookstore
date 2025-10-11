const express = require("express");
const multer  = require('multer');
const storageMulter = require('../../helper/storageMulter.js');
const upload = multer({ storage : storageMulter() });
const router = express.Router();
const controller = require("../../controllers/admin/product.controller.js");

router.get('/', controller.index);
router.patch('/change-status/:id/:status', controller.changeStatus);
router.patch('/change-multi', controller.changeMulti);
router.get('/create', controller.create);
router.post('/create', upload.single('thumbnail'), controller.createProduct);
router.delete('/delete/:id', controller.deleteProduct);
router.get('/edit/:id', controller.edit);
router.get('/detail/:id', controller.detail);

module.exports = router;
