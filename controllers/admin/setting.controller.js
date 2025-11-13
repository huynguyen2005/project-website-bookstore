const { prefixAdmin } = require("../../config/system");
const SettingGeneral = require("../../models/setting-general.model");

module.exports.index = (req, res) => {
    res.render('admin/pages/settings/index', {
        pageTitle: "Cài đặt chung | Admin",
        activeMenu: "settings",
    })
}

module.exports.general = async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({});
    res.render('admin/pages/settings/general', {
        pageTitle: "Cài đặt chung | Admin",
        activeMenu: "settings",
        settingGeneral: settingGeneral
    });
}

module.exports.generalPatch = async (req, res) => {
    try {
        const settingGeneral = await SettingGeneral.findOne({});
        if (settingGeneral) {
            const updatedBy = {
                account_id: res.locals.user.id,
                updateAt: Date.now()
            }
            await settingGeneral.updateOne({ _id: settingGeneral.id }, {
                ...req.body,
                $push: { updatedBy: updatedBy }
            });
            req.flash("success", "Cập nhật thành công");
        } else {
            const createdBy = {
                account_id: res.locals.user._id,
            }
            req.body.createdBy = createdBy;
            const settingGeneral = new SettingGeneral(req.body);
            await settingGeneral.save();
            req.flash("success", "Thêm thành công");
        }
    } catch (e) {
        req.flash("error", "Cập nhật thất bại");
    }
    res.redirect(`${prefixAdmin}/settings/general`);
}