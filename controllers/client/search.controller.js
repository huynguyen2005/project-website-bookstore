const Book = require("../../models/book.model");
const bookHelper = require("../../helpers/book");

//[GET] /search/
module.exports.index = async (req, res) => {
    const keyword = req.query.keyword;
    let newBooks = [];
    if(keyword){
        const regex = new RegExp(keyword, "i");
        const books = await Book.find({
            bookName: regex,
            status: "active",
            deleted: false
        }).sort({ position: "desc"});
        newBooks = bookHelper.newPriceBook(books);
    }
    
    res.render("client/pages/search/index", {
        pageTitle: "Kết quả tìm kiếm",
        keyword: keyword,
        books: newBooks
    });
}