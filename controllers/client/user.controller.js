const User = require("../../models/user.model");
const md5 = require("md5");

//[GET] /user/register
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng ký | BookStore"
    });
}

//[POST] /user/register
module.exports.registerPost = async (req, res) => {
    try {
        const exitUser = await User.findOne({ email: req.body.email, deleted: false });
        if (exitUser) {
            req.flash("error", "Email này đã tồn tại!");
            return res.redirect("/user/register");
        }
        req.body.password = md5(req.body.password);
        const user = new User(req.body);
        await user.save();
        req.flash("success", "Đăng ký tài khoản thành công");
        res.redirect("/user/login");
    } catch (error) {
        res.redirect("/user/register");
    }
}

//[GET] /user/login
module.exports.login = async (req, res) => {
    res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập | BookStore"
    });
}

//[POST] /user/login
module.exports.loginPost = async (req, res) => {
    const user = await User.findOne({email: req.body.email, deleted: false});
    if(!user){
        req.flash("error", "Email không tồn tại");
        return res.redirect("/user/login");
    }
    if(md5(req.body.password) !== user.password){
        req.flash("error", "Sai mật khẩu");
        return res.redirect("/user/login");
    }
    if(user.status === "inactive"){
        req.flash("error", "Tài khoản không hoạt động");
        return res.redirect("/user/login");
    }
    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/");
}

//[GET] /user/logout
module.exports.logout = (req, res) => {
    res.clearCookie("tokenUser");
    res.redirect("/");
}

//[GET] /user/password/forgot
module.exports.passwordForgot = (req, res) => {
    res.render("client/pages/user/password-forgot", {
        pageTitle: "Quên mật khẩu"
    })
}