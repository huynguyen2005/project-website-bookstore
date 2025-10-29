const { prefixAdmin } = require("../../config/system");
const Account = require("../../models/account.model");

//[GET] /admin/my-account
module.exports.index = (req, res) => {
    res.render("admin/pages/my-account/index", {
        pageTitle: "Thông tin tài khoản | Admin"
    });
}

//[GET] /admin/my-account/edit
module.exports.edit = (req, res) => {
    res.render("admin/pages/my-account/edit", {
        pageTitle: "Chỉnh sửa tài khoản | Admin"
    });
}

//[PATCH] /admin/my-account/edit
module.exports.editInfor = async (req, res) => {
    const emailExit = await Account.findOne({
        _id: {$ne : res.locals.user._id},
        email: req.body.email,
        deleted: false
    });
    if(emailExit){
        req.flash("error", `Email ${email} đã tồn tại!`);
        res.redirect(`${prefixAdmin}/my-account/edit`);
        return;
    }
    if(req.body.password){
        req.body.password = md5(req.body.password);
    }else{
        delete req.body.password;
    }
    try {
        await Account.updateOne({_id: res.locals.user._id}, req.body);
        req.flash("success", `Sửa tài khoản thành công`);
    } catch (error) {
        req.flash("error", `Sửa tài khoản thất bại!`);
    }
    res.redirect(`${prefixAdmin}/my-account/edit`);
}