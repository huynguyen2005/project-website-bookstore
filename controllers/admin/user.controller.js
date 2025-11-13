const User = require("../../models/user.model");
const systemConfig = require("../../config/system");
const searchInforHelper = require("../../helpers/searchInfor");

// [GET] /admin/users
module.exports.index = async (req, res) => {
    let find = { deleted: false };
    const objectPagination = { currentPage: 1, limitItems: 5 };

    if (req.query.page) objectPagination.currentPage = parseInt(req.query.page);

    const totalItem = await User.countDocuments({ deleted: false });
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;
    objectPagination.totalPage = Math.ceil(totalItem / objectPagination.limitItems);

    const objectSearch = searchInforHelper(req.query.keyword);
    if (objectSearch.regex) find.fullName = objectSearch.regex;

    if (req.query.status) find.status = req.query.status;

    const users = await User.find(find)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    res.render("admin/pages/users/index", {
        pageTitle: "Người dùng | Admin",
        activeMenu: "users", 
        users: users,
        pagination: objectPagination,
        keyword: objectSearch.keyword
    });
};

// [DELETE] /admin/users/delete/:id
module.exports.deleteUser = async (req, res) => {
    const id = req.params.id;
    const page = req.query.page;
    await User.updateOne({ _id: id }, {
        deleted: true,
        deleteAt: Date.now()
    });
    req.flash("success", "Xóa người dùng thành công");
    res.redirect(`${systemConfig.prefixAdmin}/users?page=${page}`);
};

// [GET] /admin/users/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    const user = await User.findOne({ _id: id }).select("-password");

    const updatedBy = user.updatedBy ? user.updatedBy.slice(-1)[0] : null;
    if (updatedBy) {
        const updater = await User.findOne({ _id: updatedBy.account_id }).select("-password");
        updatedBy.fullName = updater ? updater.fullName : "";
    }

    res.render("admin/pages/users/detail", {
        pageTitle: "Chi tiết người dùng | Admin",
        user: user
    });
};
