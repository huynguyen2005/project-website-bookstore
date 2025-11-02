const Book = require("../../models/book.model");
const BookCategory = require("../../models/book-category.model");
const CoverType = require("../../models/cover-type.model");
const Author = require("../../models/author.model");
const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");
const searchInforHelper = require("../../helpers/searchInfor");

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

    // Search book
    const objectSearch = searchInforHelper(req.query.keyword);
    if (objectSearch.regex) {
        find.bookName = objectSearch.regex;
    }

    // Lấy danh mục sách
    const bookCategories = await BookCategory.find({ deleted: false });
    const newBookCategories = createTreeHelper.createTree(bookCategories);

    // Lấy loại bìa
    const coverTypes = await CoverType.find({ deleted: false });

    // Filter book
    if (req.query.status) {
        find.status = req.query.status;
    }
    if (req.query.book_category_id) {
        find.book_category_id = req.query.book_category_id;
    }
    if (req.query.coverType_id) {
        find.coverType_id = req.query.coverType_id;
    }

    const books = await Book.find(find)
        .sort({ position: "desc" })
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    const newBooks = books.map(item => {
        item.newPrice = item.price - (item.price * (item.discountPercent / 100));
        return item;
    });

    for (const book of newBooks) {
        const account = await Account.findOne({ _id: book.createdBy.account_id }).select("-password");
        if (account) {
            book.accountFullName = account.fullName;
        }
    }
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
    const updatedBy = {
        account_id: res.locals.user.id,
        updateAt: Date.now()
    }
    await Book.updateOne({ _id: id }, {
        status: status,
        $push: { updatedBy: updatedBy }
    });
    req.flash('success', 'Cập nhật trạng thái sách thành công');
    res.redirect(`${systemConfig.prefixAdmin}/books/?page=${page}`);
};

// [PATCH] /admin/books/change-multi
module.exports.changeMulti = async (req, res) => {
    const ids = req.body.ids.split(", ");
    const type = req.body.type;

    const updatedBy = {
        account_id: res.locals.user.id,
        updateAt: Date.now()
    }
    switch (type) {
        case "active":
        case "inactive":
            await Book.updateMany({ _id: { $in: ids } }, { status: type, $push: { updatedBy: updatedBy } });
            req.flash('success', 'Cập nhật trạng thái sách thành công');
            break;
        case "delete-all":
            const deletedBy = {
                account_id: res.locals.user.id,
                deletedAt: Date.now()
            }
            await Book.updateMany({ _id: { $in: ids } }, { deleted: true, deletedBy: deletedBy });
            req.flash('success', 'Xóa sách thành công');
            break;
        default:
            break;
    }
    res.redirect(`${systemConfig.prefixAdmin}/books?page=${req.query.page}`);
};

// [GET] /admin/books/create
module.exports.create = async (req, res) => {
    const bookCategories = await BookCategory.find({ deleted: false });
    const newBookCategories = createTreeHelper.createTree(bookCategories);

    const coverTypes = await CoverType.find({ deleted: false });

    const authors = await Author.find({ deleted: false }).select('_id fullName');

    res.render("admin/pages/books/create", {
        pageTitle: "Thêm sách | Admin",
        activeMenu: "books",
        activeSubMenu: "createBook",
        bookCategories: newBookCategories,
        coverTypes: coverTypes,
        authors: authors
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

    const createdBy = {
        account_id: res.locals.user._id,
    }
    req.body.createdBy = createdBy;

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
        deletedBy: {
            account_id: res.locals.user._id,
            deletedAt: Date.now()
        }
    });
    req.flash('success', 'Xóa sách thành công');
    res.redirect(`${systemConfig.prefixAdmin}/books?page=${page}`);
};

// [GET] /admin/books/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;
    const book = await Book.findOne({ _id: id });

    if (!book) {
        req.flash('error', 'Không tìm thấy sách');
        return res.redirect(`${systemConfig.prefixAdmin}/books`);
    }

    const bookCategories = await BookCategory.find({ deleted: false });
    const newBookCategories = createTreeHelper.createTree(bookCategories);

    const coverTypes = await CoverType.find({ deleted: false });
    const authors = await Author.find({ deleted: false }).select('_id fullName');

    res.render("admin/pages/books/edit", {
        pageTitle: "Chỉnh sửa sách | Admin",
        book: book,
        activeMenu: "books",
        activeSubMenu: "bookList",
        bookCategories: newBookCategories,
        coverTypes: coverTypes,
        authors: authors
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

    const updatedBy = {
        account_id: res.locals.user.id,
        updateAt: Date.now()
    }

    try {
        await Book.updateOne({ _id: id }, {
            ...req.body,
            $push: { updatedBy: updatedBy }
        });
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
    let author = "";

    if (book.book_category_id) {
        category = await BookCategory.findOne({ _id: book.book_category_id });
    }
    if (book.coverType_id) {
        coverType = await CoverType.findOne({ _id: book.coverType_id });
    }
    if (book.author_id) {
        author = await Author.findOne({ _id: book.author_id });
    }

    const account = await Account.findOne({ _id: book.createdBy.account_id }).select("-password");
    if (account) {
        book.accountFullName = account.fullName;
    }

    const updatedBy = book.updatedBy.slice(-1)[0];
    if (updatedBy) {
        const account = await Account.findOne({ _id: updatedBy.account_id }).select("-password");
        updatedBy.fullName = account.fullName;
    }

    res.render("admin/pages/books/detail", {
        pageTitle: "Chi tiết sách | Admin",
        book: book,
        categoryName: category ? category.title : "",
        coverTypeName: coverType ? coverType.title : "",
        authorName: author ? author.fullName : ""
    });
};
