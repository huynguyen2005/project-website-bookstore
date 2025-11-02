const BookCategory = require("../../models/book-category.model");
const Book = require("../../models/book.model");
const Author = require("../../models/author.model");
const CoverType = require("../../models/cover-type.model");
const book = require("../../helpers/book");
const categoryHelper = require("../../helpers/subCategory");

//[GET] /collections/:slugCategory
module.exports.index = async (req, res) => {
    const {author, coverType, price} = req.query;
    let authorFilter = {};
    if(author){
        const authorsArr = Array.isArray(author) ? author : [author];
        const idAuthors = (await Author.find({slug : {$in : authorsArr}})).map(item => item.id);
        authorFilter = {author_id : { $in : [...idAuthors]}};
    }

    let coverTypeFilter = {};
    if(coverType){
        const coverTypesArr = Array.isArray(coverType) ? coverType : [coverType];
        const idCoverTypes = (await Author.find({slug : {$in : coverTypesArr}})).map(item => item.id);
        coverTypeFilter = {coverType_id : { $in : [...idCoverTypes]}};
    }

    let priceFilter = {};
    if(price){
        if (price === "500000-plus") {
            priceFilter =  { price: { $gte: 500000 } };
        } else {
            const [min, max] = price.split("-").map(Number);
            priceFilter = { price: { $gte: min, $lte: max } };
        }
    }
    
    const slugCategory = req.params.slugCategory;
    const bookCategory = await BookCategory.findOne({
        slug: slugCategory
    });

    //Lấy ra các id thuộc danh mục bookCategory
    const childId = (await categoryHelper.category(bookCategory._id)).map(item => item.id);
    //End

    const books = await Book.find({
        book_category_id: { $in : [bookCategory._id, ...childId]},
        status: "active",
        deleted: false,
        ...authorFilter,
        ...coverTypeFilter,
        ...priceFilter
    }).sort({position : "desc"});

    let newBooks = [];
    if(books.length){
        newBooks = book.newPriceBook(books);
    }

    const authors = await Author.find({deleted: false});
    const coverTypes = await CoverType.find({deleted: false});

    res.render("client/pages/book/index", {
        pageTitle : `${bookCategory.title} - BookStore`,
        categoryName: bookCategory.title,
        books: newBooks,
        authors: authors,
        coverTypes: coverTypes
    });
}