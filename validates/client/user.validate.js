module.exports.registerPost = (req, res, next) => {
    if(!req.body.fullName){
        req.flash("error", "Vui lòng nhập họ tên");
        return res.redirect("/user/register");
    }
    if(!req.body.email){
        req.flash("error", "Vui lòng nhập email");
        return res.redirect("/user/register");
    }
    if(!req.body.password){
        req.flash("error", "Vui lòng nhập password");
        return res.redirect("/user/register");
    }
    next(); 
}

module.exports.loginPost = (req, res, next) => {
    if(!req.body.email){
        req.flash("error", "Vui lòng nhập email");
        return res.redirect("/user/login");
    }
    if(!req.body.password){
        req.flash("error", "Vui lòng nhập password");
        return res.redirect("/user/login");
    }
    next(); 
}

module.exports.passwordForgotPost = (req, res, next) => {
    if(!req.body.email){
        req.flash("error", "Vui lòng nhập email");
        return res.redirect("/user/password/forgot");
    }
    next(); 
}

module.exports.otpPasswordPost = (req, res, next) => {
    if(!req.body.otp){
        req.flash("error", "Vui lòng nhập otp");
        return res.redirect(`/user/password/otp?email=${email}`);
    }
    next(); 
}


module.exports.resetPasswordPost = (req, res, next) => {
    if(!req.body.password){
        req.flash("error", "Vui lòng nhập mật khẩu mới");
        return res.redirect(`/user/password/reset`);
    }
    if(!req.body.passwordConfirm){
        req.flash("error", "Vui lòng nhập xác nhận mật khẩu mới");
        return res.redirect(`/user/password/reset`);
    }
    if(req.body.password !== req.body.passwordConfirm){
        req.flash("error", "Mật khẩu không khớp");
        return res.redirect(`/user/password/reset`);
    }
    next(); 
}