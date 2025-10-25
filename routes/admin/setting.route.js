const expess = require("express");
const router = expess.Router();
const controller = require('../../controllers/admin/setting.controller');

router.get('/', controller.index);

module.exports = router;