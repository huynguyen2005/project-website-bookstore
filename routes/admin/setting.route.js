const expess = require("express");
const router = expess.Router();
const multer = require("multer");
const upload = multer();

const controller = require('../../controllers/admin/setting.controller');
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware.js");


router.get('/', controller.index);
router.get('/general', controller.general);
router.patch(
    "/general",
    upload.fields([
        { name: "thumbnail", maxCount: 1 }
    ]),
    uploadCloud.upload,
    controller.generalPatch
);

module.exports = router;