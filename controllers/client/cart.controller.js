const Cart = require("../../models/cart.model.js");
const Book = require("../../models/book.model.js");
const bookHelper = require("../../helpers/book.js");

//[GET] /cart
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
    res.render("client/pages/cart/index", {
        pageTitle: "Giỏ hàng của bạn - BookStore",
        cart: cart
    });
}

//[POST] /cart/add/:bookId
module.exports.addPost = async (req, res) => {
    const cartId = req.cookies.cartId;
    const book_id = req.params.bookId;
    const quantity = parseInt(req.body.quantity);

    const cart = await Cart.findOne({
        _id: cartId
    });

    const existBookInCart = cart.books.find(item => item.book_id === book_id);
    if (existBookInCart) {
        const newQuantity = quantity + existBookInCart.quantity;

        //Cập nhật lại 1 trường trong object
        await Cart.updateOne({
            _id: cartId,
            "books.book_id": book_id
        },
            {
                $set: {
                    "books.$.quantity": newQuantity
                }
            });
    }
    else {
        const objectBook = {
            book_id: book_id,
            quantity: quantity
        }
        await Cart.updateOne({
            _id: cartId
        }, {
            $push: {
                books: objectBook
            }
        });
    }
    const book = await Book.findOne({_id: book_id});
    res.redirect(`/books/${book.slug}`);
}

//[GET] /cart/delete/:bookId
module.exports.delete = async (req, res) => {
    const cartId = req.cookies.cartId;
    const bookId = req.params.bookId;
    //Xóa đối tượng từ mảng
    try {
        await Cart.updateOne({
            _id: cartId
        }, {
            $pull: { books: { book_id: bookId } }
        });
    }
    catch(e){
        console.log(e);
    }
    res.redirect("/cart");
}

//[GET] /cart/update/:bookId
module.exports.update = async (req, res) => {
    const cartId = req.cookies.cartId;
    const bookId = req.params.bookId;
    const quantity = req.params.quantity;

    await Cart.updateOne({
        _id: cartId,
        "books.book_id" : bookId
    }, {
        $set : {
            "books.$.quantity" : quantity
        }
    });
    res.redirect("/cart");
}