const Author = require('../../models/author.model');
const Account = require('../../models/account.model');
const systemConfig = require('../../config/system');
const searchInforHelper = require('../../helpers/searchInfor');

// [GET] /admin/authors
module.exports.index = async (req, res) => {
    const find = { deleted: false };

    const keyword = req.query.keyword;
    const objectSearch = searchInforHelper(keyword);
    if (objectSearch.regex) {
        find.fullName = objectSearch.regex;
    }

    const authors = await Author.find(find);

    for (const author of authors) {
        const account = await Account.findOne({ _id: author.createdBy.account_id }).select('-password');
        if (account) {
            author.accountFullName = account.fullName;
        }
    }

    res.render("admin/pages/authors/index", {
        pageTitle: "Danh sách tác giả | Admin",
        activeMenu: "books",
        activeSubMenu: "authorList",
        records: authors,
        keyword: keyword,
    });
};

// [GET] /admin/authors/create
module.exports.create = (req, res) => {
    res.render("admin/pages/authors/create", {
        pageTitle: "Thêm tác giả | Admin",
        activeMenu: "books",
        activeSubMenu: "authorList",
    });
};

// [POST] /admin/authors/create
module.exports.createAuthor = async (req, res) => {
    const createdBy = {
        account_id: res.locals.user._id,
    }
    req.body.createdBy = createdBy;
    try {
        const author = new Author(req.body);
        console.log(author);
        await author.save();
        req.flash("success", "Thêm tác giả thành công");
    } catch (error) {
        req.flash("error", "Thêm tác giả thất bại");
    }
    res.redirect(`${systemConfig.prefixAdmin}/authors`);
};

// [GET] /admin/authors/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    const record = await Author.findOne({ _id: id, deleted: false });

    if (!record) {
        req.flash("error", "Không tìm thấy tác giả");
        return res.redirect(`${systemConfig.prefixAdmin}/authors`);
    }

    const account = await Account.findOne({ _id: record.createdBy.account_id }).select('-password');
    if (account) {
        record.accountFullName = account.fullName;
    }

    const updatedBy = record.updatedBy.slice(-1)[0];
    if (updatedBy) {
        const accountUpdated = await Account.findOne({ _id: updatedBy.account_id }).select('-password');
        updatedBy.fullName = accountUpdated ? accountUpdated.fullName : '—';
    }

    res.render("admin/pages/authors/detail", {
        pageTitle: "Chi tiết tác giả | Admin",
        activeMenu: "books",
        activeSubMenu: "authorList",
        record: record,
    });
};

// [GET] /admin/authors/edit/:id
module.exports.edit = async (req, res) => {
    const record = await Author.findOne({ _id: req.params.id, deleted: false });

    if (!record) {
        req.flash("error", "Không tìm thấy tác giả");
        return res.redirect(`${systemConfig.prefixAdmin}/authors`);
    }

    res.render("admin/pages/authors/edit", {
        pageTitle: "Chỉnh sửa tác giả | Admin",
        activeMenu: "books",
        activeSubMenu: "authorList",
        record: record,
    });
};

// [PATCH] /admin/authors/edit/:id
module.exports.editAuthor = async (req, res) => {
    const id = req.params.id;
    const updatedBy = {
        account_id: res.locals.user._id,
        updateAt: Date.now()
    };

    try {
        await Author.updateOne({ _id: id }, {
            ...req.body,
            $push: { updatedBy: updatedBy }
        });
        req.flash("success", "Cập nhật tác giả thành công");
        res.redirect(`${systemConfig.prefixAdmin}/authors`);
    } catch (error) {
        req.flash("error", "Cập nhật tác giả thất bại");
        res.redirect(`${systemConfig.prefixAdmin}/authors/edit/${id}`);
    }
};

// [DELETE] /admin/authors/delete/:id
module.exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        await Author.updateOne({ _id: id }, {
            deleted: true,
            deletedBy: {
                account_id: res.locals.user._id,
                deletedAt: Date.now()
            }
        });
        req.flash("success", "Xóa tác giả thành công");
        res.redirect(`${systemConfig.prefixAdmin}/authors`);
    } catch (error) {
        req.flash("error", "Xóa tác giả thất bại");
        res.redirect(`${systemConfig.prefixAdmin}/authors`);
    }
};
