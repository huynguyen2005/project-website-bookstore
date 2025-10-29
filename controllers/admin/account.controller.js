const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
const searchInforHelper = require("../../helpers/searchInfor");
const md5 = require('md5');

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    let find = { deleted: false };

    const objectPagination = {
        currentPage: 1,
        limitItems: 5,
    };

    if (req.query.page) {
        objectPagination.currentPage = parseInt(req.query.page);
    }

    const totalItem = await Account.countDocuments({ deleted: false });
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;
    objectPagination.totalPage = Math.ceil(totalItem / objectPagination.limitItems);

    const objectSearch = searchInforHelper(req.query.keyword);
    if (objectSearch.regex) {
        find.fullName = objectSearch.regex;
    }

    if (req.query.status) {
        find.status = req.query.status;
    }
    if (req.query.role_id) {
        find.role_id = req.query.role_id;
    }

    const roles = await Role.find({ deleted: false });

    const accounts = await Account.find(find)
        .select("-password -token")
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);


    res.render("admin/pages/accounts/index", {
        pageTitle: "Tài khoản | Admin",
        activeMenu: "setting",
        accounts: accounts,
        pagination: objectPagination,
        keyword: objectSearch.keyword,
        records: roles,
        filter: {
            status: req.query.status || "",
            role_id: req.query.role_id || "",
        },
    });
};

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    const roles = await Role.find({ deleted: false });
    res.render("admin/pages/accounts/create", {
        pageTitle: "Thêm tài khoản | Admin",
        activeMenu: "setting",
        roles: roles,
    });
};

// [POST] /admin/accounts/create
module.exports.createAccount = async (req, res) => {
    try {
        const emailExit = await Account.findOne({
            email: req.body.email,
            deleted: false
        });
        if (emailExit) {
            req.flash("error", `Email ${req.body.email} đã tồn tại`);
            res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
        }
        else {
            req.body.password = md5(req.body.password);
            const account = new Account(req.body);
            await account.save();
            req.flash("success", "Thêm tài khoản thành công");
            res.redirect(`${systemConfig.prefixAdmin}/accounts`);
        }
    } catch (error) {
        req.flash("error", "Thêm tài khoản thất bại");
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
};

// [DELETE] /admin/accounts/delete/:id
module.exports.deleteAccount = async (req, res) => {
    const id = req.params.id;
    const page = req.query.page;
    await Account.updateOne(
        { _id: id },
        { deleted: true, deletedAt: new Date() }
    );
    req.flash("success", "Xóa tài khoản thành công");
    res.redirect(`${systemConfig.prefixAdmin}/accounts?page=${page}`);
};

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;
    const account = await Account.findOne({ _id: id });
    const roles = await Role.find({ deleted: false });

    res.render("admin/pages/accounts/edit", {
        pageTitle: "Chỉnh sửa tài khoản | Admin",
        activeMenu: "setting",
        account: account,
        records: roles,
    });
};

// [PATCH] /admin/accounts/edit/:id
module.exports.editAccount = async (req, res) => {
    try {
        const id = req.params.id;
        const emailExit = await Account.findOne({
            _id: { $ne: id },
            email: req.body.email,
            deleted: false
        });
        if (emailExit) {
            req.flash("error", `Email ${req.body.email} đã tồn tại`);
            res.redirect(`${systemConfig.prefixAdmin}/accounts/edit/${id}`);
        } else {
            if (req.body.password) {
                req.body.password = md5(req.body.password);
            } else {
                delete req.body.password;
            }
            await Account.updateOne({ _id: id }, req.body);
            req.flash("success", "Cập nhật tài khoản thành công");
            res.redirect(`${systemConfig.prefixAdmin}/accounts/edit/${id}`);
        }
    } catch (error) {
        req.flash("error", "Cập nhật tài khoản thất bại");
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
};

