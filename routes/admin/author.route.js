const express = require("express");
const router = express.Router();
const controller = require('../../controllers/admin/author.controller');

router.get('/', controller.index);
router.get('/create', controller.create);
router.post('/create', controller.createAuthor);
router.get('/detail/:id', controller.detail);
router.get('/edit/:id', controller.edit);
router.patch('/edit/:id', controller.editAuthor);
router.delete('/delete/:id', controller.delete);

module.exports = router;
