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