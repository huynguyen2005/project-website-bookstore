const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const md5 = require("md5");
const generateHelper = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail");
const bookHelper = require("../../helpers/book");
const Order = require("../../models/order.model");
const Book = require("../../models/book.model");
const Cart = require("../../models/cart.model");

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
    const exitUserIdinCart = await Cart.findOne({user_id: user.id});
    if(exitUserIdinCart){
        res.cookie("cartId", exitUserIdinCart.id);
    }else{
        await Cart.updateOne({_id: req.cookies.cartId}, {user_id: user.id});
    }
    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/");
}

//[GET] /user/logout
module.exports.logout = (req, res) => {
    res.clearCookie("tokenUser");
    res.clearCookie("cartId");
    res.redirect("/");
}

//[GET] /user/password/forgot
module.exports.passwordForgot = (req, res) => {
    res.render("client/pages/user/password-forgot", {
        pageTitle: "Quên mật khẩu"
    })
}

//[POST] /user/password/forgot
module.exports.passwordForgotPost = async (req, res) => {
    const email = req.body.email;
    const exitEmail = await User.findOne({email: email, status: "active", deleted: false});
    if(!exitEmail){
        req.flash("error", "Email không tồn tại!!!");
        return res.redirect("/user/password/forgot");
    }
    //Kiểm tra xem email đã được gửi mã chưa
    const emailInRecord = await ForgotPassword.findOne({email: email});
    if(emailInRecord){
        req.flash("error", "Đã gửi mã OTP về email vui lòng chờ 3 phút sau để gửi lại!!!");
        return res.redirect("/user/password/forgot");
    }
    //Lưu thông tin vào DB
    const otp = generateHelper.generateRandomString(8);
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `Mã OTP để lấy lại mật khẩu là: <b>${otp}</b>. Thời gian sử dụng là 3 phút`;
    const forgotPassword = new ForgotPassword({
        email: email,
        otp: otp,
        expireAt: Date.now()
    });
    await forgotPassword.save();
    sendMailHelper.sendMail(email, subject, html);
    res.redirect(`/user/password/otp?email=${email}`);
}

//[GET] /user/password/otp
module.exports.otpPassword = (req, res) => {
    const email = req.query.email;
    res.render("client/pages/user/otp-password", {
        pageTitle: "Nhập mã OTP",
        email: email
    })
}


//[POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;
    const result = await ForgotPassword.findOne({email: email, otp: otp});
    if(!result){
        req.flash("error", "Mã OTP không chính xác!");
        return res.redirect(`/user/password/otp?email=${email}`);
    }
    const user = await User.findOne({email: email});
    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/user/password/reset");
}

//[GET] /user/password/reset
module.exports.resetPassword = (req, res) => {
    res.render("client/pages/user/reset-password", {
        pageTitle: "Cập nhật mật khẩu mới"
    });
}

//[POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;
    await User.updateOne({tokenUser: tokenUser}, {password: md5(password)});
    res.redirect("/");
}

//[GET] /user/infor
module.exports.inforUser = async (req, res) => {
    res.render("client/pages/user/infor", {
        pageTitle: "Tài khoản | BookStore"
    });
}

//[POST] /user/infor
module.exports.inforUserPost = async (req, res) => {
    try {
        await User.updateOne({tokenUser: req.cookies.tokenUser}, req.body);
        req.flash("success", "Cập nhật thành công");
    } catch (error) {
        req.flash("error", "Cập nhật thất bại!!!");
    }
    res.redirect("/user/infor");
}

//[GET] /user/order-list
module.exports.orderList = async (req, res) => {
    const orders = await Order.find({user_id: res.locals.user.id});
    res.render("client/pages/user/order-list", {
        pageTitle: "Lịch sử mua hàng | BookStore",
        orders: orders
    });
}

//[GET] /order/order-detail/:orderId
module.exports.orderDetail = async (req, res) => {
    const orderId = req.params.orderId;
    const order = await Order.findOne({_id: orderId});
    console.log(order);
    for (let book of order.books) {
        const inforBook = await Book.findOne({_id: book.book_id});
        book.bookName = inforBook.bookName;
        bookHelper.newPriceOneBook(book);
        book.totalPrice = book.newPrice * book.quantity;
    }
    order.totalPrice = order.books.reduce((sum, item) => sum + item.totalPrice, 0);
    res.render("client/pages/user/order-detail", {
        pageTitle: "Chi tiết đơn hàng | BookStore",
        order: order
    });
}