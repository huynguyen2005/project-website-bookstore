const Book = require("../../models/book.model");
const Author = require('../../models/author.model');
const CoverType = require('../../models/cover-type.model');
const bookHelper = require('../../helpers/book');

//[GET] /books/:slugBook
module.exports.detail = async (req, res) => {
    const slugBook = req.params.slugBook;
    const book = await Book.findOne({slug: slugBook});
    bookHelper.newPriceOneBook(book);

    const author = await Author.findOne({_id: book.author_id, deleted: false});
    const coverType = await CoverType.findOne({_id: book.coverType_id, deleted: false});

    res.render('client/pages/book/detail', {
        pageTitle: book.bookName + ' - BookStore',
        book: book,
        author: author,
        coverType: coverType
    })
}