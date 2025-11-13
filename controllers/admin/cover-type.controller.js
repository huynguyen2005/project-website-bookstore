const CoverType = require('../../models/cover-type.model');
const Account = require('../../models/account.model');
const systemConfig = require('../../config/system');
const searchInforHelper = require('../../helpers/searchInfor');

// [GET] /admin/cover-types
module.exports.index = async (req, res) => {
    const find = { deleted: false };

    const keyword = req.query.keyword;
    const objectSearch = searchInforHelper(keyword);
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    const coverTypes = await CoverType.find(find);

    for (const coverType of coverTypes) {
        const account = await Account.findOne({ _id: coverType.createdBy.account_id }).select('-password');
        if (account) {
            coverType.accountFullName = account.fullName;
        }
    }

    res.render("admin/pages/cover-types/index", {
        pageTitle: "Danh sách loại bìa | Admin",
        activeMenu: "books",
        activeSubMenu: "coverTypeList",
        records: coverTypes,
        keyword: keyword,
    });
};

// [GET] /admin/cover-types/create
module.exports.create = (req, res) => {
    res.render("admin/pages/cover-types/create", {
        pageTitle: "Thêm loại bìa | Admin",
        activeMenu: "books",
        activeSubMenu: "coverTypeList",
    });
};

// [POST] /admin/cover-types/create
module.exports.createCoverType = async (req, res) => {
    const createdBy = {
        account_id: res.locals.user._id,
    };
    req.body.createdBy = createdBy;

    try {
        const coverType = new CoverType(req.body);
        await coverType.save();
        req.flash("success", "Thêm loại bìa thành công");
        res.redirect(`${systemConfig.prefixAdmin}/cover-types`);
    } catch (error) {
        req.flash("error", "Thêm loại bìa thất bại");
        res.redirect(`${systemConfig.prefixAdmin}/cover-types`);
    }
};

// [GET] /admin/cover-types/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    const record = await CoverType.findOne({ _id: id, deleted: false });

    if (!record) {
        req.flash("error", "Không tìm thấy loại bìa");
        return res.redirect(`${systemConfig.prefixAdmin}/cover-types`);
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

    res.render("admin/pages/cover-types/detail", {
        pageTitle: "Chi tiết loại bìa | Admin",
        activeMenu: "books",
        activeSubMenu: "coverTypeList",
        record: record,
    });
};

// [GET] /admin/cover-types/edit/:id
module.exports.edit = async (req, res) => {
    const record = await CoverType.findOne({ _id: req.params.id, deleted: false });

    if (!record) {
        req.flash("error", "Không tìm thấy loại bìa");
        return res.redirect(`${systemConfig.prefixAdmin}/cover-types`);
    }

    res.render("admin/pages/cover-types/edit", {
        pageTitle: "Chỉnh sửa loại bìa | Admin",
        activeMenu: "books",
        activeSubMenu: "coverTypeList",
        record: record,
    });
};

// [PATCH] /admin/cover-types/edit/:id
module.exports.editCoverType = async (req, res) => {
    const id = req.params.id;
    const updatedBy = {
        account_id: res.locals.user._id,
        updateAt: Date.now()
    };

    try {
        await CoverType.updateOne({ _id: id }, {
            ...req.body,
            $push: { updatedBy: updatedBy }
        });
        req.flash("success", "Cập nhật loại bìa thành công");
        res.redirect(`${systemConfig.prefixAdmin}/cover-types`);
    } catch (error) {
        req.flash("error", "Cập nhật loại bìa thất bại");
        res.redirect(`${systemConfig.prefixAdmin}/cover-types/edit/${id}`);
    }
};

// [DELETE] /admin/cover-types/delete/:id
module.exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        await CoverType.updateOne({ _id: id }, {
            deleted: true,
            deletedBy: {
                account_id: res.locals.user._id,
                deletedAt: Date.now()
            }
        });
        req.flash("success", "Xóa loại bìa thành công");
        res.redirect(`${systemConfig.prefixAdmin}/cover-types`);
    } catch (error) {
        req.flash("error", "Xóa loại bìa thất bại");
        res.redirect(`${systemConfig.prefixAdmin}/cover-types`);
    }
};
