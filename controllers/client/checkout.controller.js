const Cart = require("../../models/cart.model.js");
const Book = require("../../models/book.model.js");
const Order = require("../../models/order.model.js");
const bookHelper = require("../../helpers/book.js");

//[GET] /checkout
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({ _id: cartId });

    if (cart.books.length) {
        for (const item of cart.books) {
            const bookInfor = await Book.findOne({ _id: item.book_id }).select("thumbnail bookName price stockQuantity discountPercent slug");
            bookHelper.newPriceOneBook(bookInfor);
            item.bookInfor = bookInfor;
            item.totalPrice = bookInfor.newPrice * item.quantity;
        }
        cart.total = cart.books.reduce((sum, item) => sum + item.totalPrice, 0);
    }
    res.render("client/pages/checkout/index", {
        pageTitle: "Thanh toán - BookStore",
        cart: cart
    });
}

//[POST] /checkout/order
module.exports.order = async (req, res) => {
    try {
        const cartId = req.cookies.cartId;
        const userInfor = req.body;
        const cart = await Cart.findOne({ _id: cartId });
        const books = [];
        for (const item of cart.books) {
            const objectBook = {
                book_id: item.book_id,
                quantity: item.quantity
            };
            const book = await Book.findOne({ _id: item.book_id }).select("bookName price discountPercent");
            objectBook.bookName = book.bookName;
            objectBook.price = book.price;
            objectBook.discountPercent = book.discountPercent;
            books.push(objectBook);
        }
        const order = new Order({
            user_id: res.locals.user.id,
            cart_id: cartId,
            userInfor: userInfor,
            status: "pending",
            books: books
        });
        await order.save();
        await Cart.updateOne({_id: cartId}, {books: []});
        res.redirect(`/checkout/success/${order.id}`);
    } catch (error) {
        console.log(error);
        res.redirect("/cart");
        return;
    }
}

//[GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
    const orderId = req.params.orderId;
    const order = await Order.findOne({_id: orderId});
    for (let book of order.books) {
        const inforBook = await Book.findOne({_id: book.book_id}).select("bookName thumbnail");
        book.inforBook = inforBook;
        book.priceNew = bookHelper.newPriceOneBook(book);
        book.totalPrice = book.newPrice * book.quantity;
    }
    order.totalPrice = order.books.reduce((sum, item) => sum + item.totalPrice, 0);
    res.render("client/pages/checkout/success", {
        pageTitle : "Đặt hàng thành công | BookStore",
        order: order
    })
}