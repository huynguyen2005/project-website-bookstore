const express = require("express");
const router = express.Router();
const controller = require('../../controllers/admin/cover-type.controller');

router.get('/', controller.index);
router.get('/create', controller.create);
router.post('/create', controller.createCoverType);
router.get('/detail/:id', controller.detail);
router.get('/edit/:id', controller.edit);
router.patch('/edit/:id', controller.editCoverType);
router.delete('/delete/:id', controller.delete);

module.exports = router;
