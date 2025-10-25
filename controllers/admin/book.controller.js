const Book = require("../../models/book.model");
const BookCategory = require("../../models/book-category.model");
const CoverType = require("../../models/cover-type.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helper/createTree");
const searchInforHelper = require("../../helper/searchInfor");

// [GET] /admin/books/
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };

    // Pagination
    const objectPagination = {
        currentPage: 1,
        limitItems: 5
    };
    if (req.query.page) {
        objectPagination.currentPage = parseInt(req.query.page);
    }
    const totalItem = await Book.countDocuments({ deleted: false });
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;
    objectPagination.totalPage = Math.ceil(totalItem / objectPagination.limitItems);
    // End Pagination

    // Search book
    const objectSearch = searchInforHelper(req.query.keyword);
    if(objectSearch.regex){
        find.bookName = objectSearch.regex;
    }
    // End search book


    //Lấy danh mục sách
    const bookCategories = await BookCategory.find({deleted: false});
    const newBookCategories =  createTreeHelper.createTree(bookCategories);
    //End 

    //Lấy loại bìa
    const coverTypes = await CoverType.find({deleted: false});
    //End 

    
    //Filter book
    if(req.query.status){
        find.status = req.query.status;
    }
    if(req.query.book_category_id){
        find.book_category_id = req.query.book_category_id;
    }
    if(req.query.coverType_id){
        find.coverType_id = req.query.coverType_id;
    }
    //End filter book

    const books = await Book.find(find)
        .sort({ position: "desc" })
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    const newBooks = books.map(item => {
        item.newPrice = item.price - (item.price * (item.discountPercent / 100));
        return item;
    });

    res.render("admin/pages/books/index.pug", {
        pageTitle: "Danh sách sách | Admin",
        activeMenu: "books",
        activeSubMenu: "bookList",
        books: newBooks,
        pagination: objectPagination,
        keyword: objectSearch.keyword,
        bookCategories: newBookCategories,
        coverTypes: coverTypes
    });
};

// [PATCH] /admin/books/:id
module.exports.changeStatus = async (req, res) => {
    const id = req.params.id;
    const status = req.params.status;
    const page = req.query.page;
    await Book.updateOne({ _id: id }, { status: status });
    req.flash('success', 'Cập nhật trạng thái sách thành công');
    res.redirect(`${systemConfig.prefixAdmin}/books/?page=${page}`);
};

// [PATCH] /admin/books/change-multi
module.exports.changeMulti = async (req, res) => {
    const ids = req.body.ids.split(", ");
    const type = req.body.type;
    switch (type) {
        case "active":
            await Book.updateMany({ _id: { $in: ids } }, { status: type });
            req.flash('success', 'Cập nhật trạng thái sách thành công');
            break;
        case "inactive":
            await Book.updateMany({ _id: { $in: ids } }, { status: type });
            req.flash('success', 'Cập nhật trạng thái sách thành công');
            break;
        case "delete-all":
            await Book.updateMany({ _id: { $in: ids } }, { deleted: true, deletedAt: new Date() });
            req.flash('success', 'Xóa sách thành công');
            break;
        default:
            break;
    }
    res.redirect(`${systemConfig.prefixAdmin}/books?page=${req.query.page}`);
};

// [GET] /admin/books/create
module.exports.create = async (req, res) => {
    //Lấy danh mục sách
    const bookCategories = await BookCategory.find({deleted: false});
    const newBookCategories =  createTreeHelper.createTree(bookCategories);
    //End 
    //Lấy loại bìa
    const coverTypes = await CoverType.find({deleted: false});
    //End 
    res.render("admin/pages/books/create", {
        pageTitle: "Thêm sách | Admin",
        activeMenu: "books",
        activeSubMenu: "createBook",
        bookCategories: newBookCategories,
        coverTypes: coverTypes
    });
};

// [POST] /admin/books/create
module.exports.createBook = async (req, res) => {
    req.body.price ? req.body.price = parseInt(req.body.price) : req.body.price = 0;
    req.body.discountPercent ? req.body.discountPercent = parseInt(req.body.discountPercent) : req.body.discountPercent = 0;
    req.body.pageCount ? req.body.pageCount = parseInt(req.body.pageCount) : req.body.pageCount = 0;
    req.body.stockQuantity ? req.body.stockQuantity = parseInt(req.body.stockQuantity) : req.body.stockQuantity = 0;
    req.body.averageRating ? req.body.averageRating = parseFloat(req.body.averageRating) : req.body.averageRating = 0;
    req.body.reviewCount ? req.body.reviewCount = parseInt(req.body.reviewCount) : req.body.reviewCount = 0;

    if (req.body.position) {
        req.body.position = parseInt(req.body.position);
    } else {
        const countBook = await Book.countDocuments();
        req.body.position = countBook + 1;
    }

    req.body.authorName = req.body.authorName.split(", ");

    try {
        const book = new Book(req.body);
        await book.save();
        req.flash('success', 'Thêm sách thành công');
        res.redirect(`${systemConfig.prefixAdmin}/books`);
    } catch (error) {
        req.flash('error', 'Thêm sách thất bại');
        res.redirect(`${systemConfig.prefixAdmin}/books`);
    }
};

// [DELETE] /admin/books/delete/:id
module.exports.deleteBook = async (req, res) => {
    const id = req.params.id;
    const page = req.query.page;
    await Book.updateOne({ _id: id }, {
        deleted: true,
        deletedAt: new Date()
    });
    req.flash('success', 'Xóa sách thành công');
    res.redirect(`${systemConfig.prefixAdmin}/books?page=${page}`);
};

// [GET] /admin/books/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;
    const book = await Book.findOne({ _id: id });
    //Lấy danh mục sách
    const bookCategories = await BookCategory.find({deleted: false});
    const newBookCategories =  createTreeHelper.createTree(bookCategories);
    //End 
    //Lấy loại bìa
    const coverTypes = await CoverType.find({deleted: false});
    //End 
    res.render("admin/pages/books/edit", {
        pageTitle: "Chỉnh sửa sách | Admin",
        book: book,
        activeMenu: "books",
        activeSubMenu: "bookList",
        bookCategories: newBookCategories,
        coverTypes: coverTypes
    });
};

// [PATCH] /admin/books/edit/:id
module.exports.editBook = async (req, res) => {
    const id = req.params.id;
    req.body.price ? req.body.price = parseInt(req.body.price) : req.body.price = 0;
    req.body.discountPercent ? req.body.discountPercent = parseInt(req.body.discountPercent) : req.body.discountPercent = 0;
    req.body.pageCount ? req.body.pageCount = parseInt(req.body.pageCount) : req.body.pageCount = 0;
    req.body.stockQuantity ? req.body.stockQuantity = parseInt(req.body.stockQuantity) : req.body.stockQuantity = 0;
    req.body.averageRating ? req.body.averageRating = parseFloat(req.body.averageRating) : req.body.averageRating = 0;
    req.body.reviewCount ? req.body.reviewCount = parseInt(req.body.reviewCount) : req.body.reviewCount = 0;

    if (req.body.position) {
        req.body.position = parseInt(req.body.position);
    } else {
        const countBook = await Book.countDocuments();
        req.body.position = countBook + 1;
    }

    req.body.authorName = req.body.authorName.split(", ");

    try {
        await Book.updateOne({ _id: id }, req.body);
        req.flash('success', 'Sửa sách thành công');
        res.redirect(`${systemConfig.prefixAdmin}/books/edit/${id}`);
    } catch (error) {
        req.flash('error', 'Sửa sách thất bại');
        res.redirect(`${systemConfig.prefixAdmin}/books`);
    }
};

// [GET] /admin/books/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    const book = await Book.findOne({ _id: id });
    let category = "";
    let coverType = "";
    if(book.book_category_id){
        category = await BookCategory.findOne({_id: book.book_category_id});
    }
    if(book.coverType_id){
        coverType = await CoverType.findOne({_id: book.coverType_id});
    }
    res.render("admin/pages/books/detail", {
        pageTitle: "Chi tiết sách | Admin",
        book: book,
        categoryName: category ? category.title : "",
        coverTypeName: coverType ? coverType.title : ""
    });
};
