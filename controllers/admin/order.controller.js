const Order = require("../../models/order.model");
const Book = require("../../models/book.model");
const bookHelper = require("../../helpers/book");

//[GET] /admin/orders
module.exports.index = async (req, res) => {
    const { keyword, status, fromDate, toDate } = req.query;
    const filter = {
        deleted: false
    };

    if (keyword) {
        filter.$or = [
            { ["userInfor.fullName"]: { $regex: keyword, $options: "i" } },
            { ["userInfor.phone"]: { $regex: keyword, $options: "i" } }
        ];
    }

    if (status) filter.status = status;

    if (fromDate && toDate) {
        filter.createdAt = {
            $gte: new Date(fromDate),
            $lte: new Date(toDate)
        };
    }
    const orders = await Order.find(filter);
    for (const order of orders) {
        for (let book of order.books) {
            const inforBook = await Book.findOne({ _id: book.book_id });
            book.bookName = inforBook.bookName;
            bookHelper.newPriceOneBook(book);
            book.totalPrice = book.newPrice * book.quantity;
        }
        order.totalPrice = order.books.reduce((sum, item) => sum + item.totalPrice, 0);
        order.totalQuantity = order.books.reduce((sum, item) => sum + item.quantity, 0);
    }
    res.render("admin/pages/orders/index", {
        pageTitle: "Quản lý đơn hàng | Admin",
        orders: orders,
        keyword,
        status,
        fromDate,
        toDate
    });
}

//[PATCH] /admin/orders/change-status/:orderId/:status
module.exports.changeStatus = async (req, res) => {
    const orderId = req.params.orderId;
    const status = req.params.status;
    try {
        await Order.updateOne({ _id: orderId }, { status: status });
        req.flash("success", "Cập nhật trạng thái đơn hàng thành công");
    } catch (error) {
        req.flash("error", "Cập nhật trạng thái đơn hàng thất bại");
    }
    res.redirect("/admin/orders");
}


//[GET] /admin/orders
module.exports.detail = async (req, res) => {
    const order = await Order.findOne({ _id: req.params.orderId });
    for (let book of order.books) {
        const inforBook = await Book.findOne({ _id: book.book_id });
        book.bookName = inforBook.bookName;
        bookHelper.newPriceOneBook(book);
        book.totalPrice = book.newPrice * book.quantity;
    }
    order.totalPrice = order.books.reduce((sum, item) => sum + item.totalPrice, 0);
    order.totalQuantity = order.books.reduce((sum, item) => sum + item.quantity, 0);
    res.render("admin/pages/orders/detail", {
        pageTitle: "Chi tiết đơn hàng | Admin",
        order: order
    });
}