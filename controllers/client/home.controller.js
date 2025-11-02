const Book = require("../../models/book.model");
const bookHelper = require("../../helpers/book");
//[GET] /
module.exports.index = async (req, res) => {

    //Lấy sản phẩm nổi bật
    const featuredBooks = await Book.find({
        featured: "1",
        status: "active",
        deleted: false
    }).limit(4);
    const newfeaturedBooks = bookHelper.newPriceBook(featuredBooks);
    //End

    //Lấy sản phẩm mới nhất
    const lastestBooks = await Book.find({
        status: "active",
        deleted: false
    }).sort({position : "desc"}).limit(4);
    const newlastestBooks = bookHelper.newPriceBook(lastestBooks);
    //End

    res.render("client/pages/home/index", {
        pageTitle: "BookStore | Hiệu sách online trực tuyến",
        featuredBooks: newfeaturedBooks,
        lastestBooks: newlastestBooks
    })
}