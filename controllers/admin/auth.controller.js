const { prefixAdmin } = require("../../config/system");
const Account = require("../../models/account.model");
const md5 = require("md5");

//[GET] /admin/auth/login
module.exports.login = (req, res) => {
    res.render('admin/pages/auth/login', {
        pageTitle: "Đăng nhập | Admin"
    });
}

//[POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await Account.findOne({
        email: email,
        deleted: false
    });
    if(!user){
        req.flash("error", `Email ${email} không tồn tại!`);
        res.redirect(`${prefixAdmin}/auth/login`);
        return;
    }
    if(user.password != md5(password)){
        req.flash("error", `Sai mật khẩu!`);
        res.redirect(`${prefixAdmin}/auth/login`);
        return;
    }
    if(user.status === "inactive"){
        req.flash("error", `Tài khoản đã bị khóa!`);
        res.redirect(`${prefixAdmin}/auth/login`);
        return;
    }

    res.cookie("token", user.token);
    res.redirect(`${prefixAdmin}/dashboard`);
}


//[GET] /admin/auth/logout
module.exports.logout = (req, res) => {
    res.clearCookie("token");
    res.redirect(`${prefixAdmin}/auth/login`);
}