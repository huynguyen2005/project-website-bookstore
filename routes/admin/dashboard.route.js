const expess = require("express");
const router = expess.Router();
const controller = require('../../controllers/admin/dashboard.controller');

router.get('/', controller.index);

module.exports = router;
