const Role = require('../../models/role.model');
const Account = require('../../models/account.model');
const systemConfig = require('../../config/system');
const searchInforHelper = require('../../helpers/searchInfor');

//[GET] /admin/roles
module.exports.index = async (req, res) => {
    const find = { deleted: false };

    // Search role
    const keyword = req.query.keyword;
    const objectSearch = searchInforHelper(keyword);
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }
    // End search role

    const roles = await Role.find(find);

    for (const role of roles) {
        const account = await Account.findOne({_id: role.createdBy.account_id}).select("-password");
        if(account){
            role.accountFullName = account.fullName;
        }
    }
    res.render("admin/pages/roles/index", {
        pageTitle: "Danh sách nhóm quyền | Admin",
        activeMenu: "setting",
        records: roles,
        keyword: keyword,
    });
};


//[GET] /admin/roles/create
module.exports.create = (req, res) => {
    res.render("admin/pages/roles/create", {
        pageTitle: "Thêm nhóm quyền | Admin",
        activeMenu: "setting",
    });
};


//[POST] /admin/roles/create
module.exports.createRole = async (req, res) => {
    const createdBy = {
        account_id: res.locals.user._id,
    }
    req.body.createdBy = createdBy;
    try {
        const role = new Role(req.body);
        await role.save();
        req.flash("success", "Thêm nhóm quyền thành công");
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    } catch (error) {
        req.flash("error", "Thêm nhóm quyền thất bại");
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
};

// [GET] /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    const record = await Role.findOne({ _id: id });

    //Lấy ra người tạo
    const account = await Account.findOne({_id: record.createdBy.account_id}).select("-password");
    if(account){
        record.accountFullName = account.fullName;
    }

    //Lấy ra người sửa
    const updatedBy = record.updatedBy.slice(-1)[0];
    if(updatedBy){
        const account = await Account.findOne({ _id: updatedBy.account_id }).select("-password");
        updatedBy.fullName = account.fullName;
    }

    res.render("admin/pages/roles/detail", {
        pageTitle: "Chi tiết quyền | Admin",
        record: record,
    });
};

//[GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    const find = {
        _id: req.params.id,
        deleted: false
    };
    const role = await Role.findOne(find);
    res.render("admin/pages/roles/edit", {
        pageTitle: "Chỉnh sửa nhóm quyền | Admin",
        record: role,
        activeMenu: "setting",
    });
};


//[PATCH] /admin/roles/edit/:id
module.exports.editRole = async (req, res) => {
    const id = req.params.id;

    const updatedBy = {
        account_id: res.locals.user.id,
        updateAt: Date.now()
    }
    try {
        await Role.updateOne({ _id: id }, {
            ...req.body,
            $push: {updatedBy: updatedBy}
        });
        req.flash("success", "Sửa nhóm quyền thành công");
        res.redirect(`${systemConfig.prefixAdmin}/roles/edit/${id}`);
    } catch (error) {
        req.flash("error", "Sửa nhóm quyền thất bại");
        res.redirect(`${systemConfig.prefixAdmin}/roles/edit/${id}`);
    }
};


//[DELETE] /admin/roles/delete/:id
module.exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
        await Role.updateOne({ _id: id }, {  
            deleted: true,
            deletedBy: {
                account_id: res.locals.user._id,
                deletedAt: Date.now()
            }
        });
        req.flash("success", "Xóa nhóm quyền thành công");
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    } catch (error) {
        req.flash("error", "Xóa nhóm quyền thất bại");
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
};


//[GET] /admin/roles/permissions
module.exports.permission = async (req, res) => {
    const roles = await Role.find({ deleted: false });
    res.render("admin/pages/roles/permissions", {
        pageTitle: "Phân quyền | Admin",
        roles: roles,
        activeMenu: "setting",
    });
};


//[PATCH] /admin/roles/permissions
module.exports.updatePermission = async (req, res) => {
    const datas = JSON.parse(req.body.permissions);
    const updatedBy = {
        account_id: res.locals.user.id,
        updateAt: Date.now()
    }
    for (let data of datas) {
        await Role.updateOne({ _id: data.id }, { 
            permissions: data.permissions,
            $push: {updatedBy: updatedBy}
        });
    }
    req.flash("success", "Cập nhật thành công");
    res.redirect(`${systemConfig.prefixAdmin}/roles/permissions`);
};
