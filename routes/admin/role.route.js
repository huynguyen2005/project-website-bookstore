const expess = require("express");
const router = expess.Router();
const controller = require('../../controllers/admin/role.controller');

router.get('/', controller.index);
router.get('/create', controller.create);
router.post('/create', controller.createRole);
router.get('/detail/:id', controller.detail);
router.get('/edit/:id', controller.edit);
router.patch('/edit/:id', controller.editRole);
router.delete('/delete/:id', controller.delete);
router.get('/permissions', controller.permission);
router.patch('/permissions', controller.updatePermission);


module.exports = router;