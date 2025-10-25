const Role = require('../../models/role.model');
const systemConfig = require('../../config/system');
const searchInforHelper = require('../../helper/searchInfor');

//[GET] /admin/roles
module.exports.index = async (req, res) => {
    const find = {deleted: false};

    // Search role
    const keyword = req.query.keyword;
    const objectSearch = searchInforHelper(keyword);
    if(objectSearch.regex){
        find.title = objectSearch.regex;
    }
    // End search role

    const roles = await Role.find(find);

    res.render("admin/pages/roles/index", {
        pageTitle: "Danh sách nhóm quyền | Admin",
        roles: roles,
        keyword: keyword
    });
}


//[GET] /admin/roles/create
module.exports.create = (req, res) => {
    res.render("admin/pages/roles/create", {
        pageTitle: "Thêm nhóm quyền | Admin",
    });
}


//[POST] /admin/roles/create
module.exports.createRole = async (req, res) => {
    try {
        const role = new Role(req.body);
        await role.save();
        req.flash("success", "Thêm nhóm quyền thành công");
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    } catch (error) {
        req.flash("error", "Thêm nhóm quyền thất bại");
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
}

//[GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    const find = {
        _id: req.params.id,
        deleted: false
    }
    const role = await Role.findOne(find);
    res.render('admin/pages/roles/edit', {
        pageTitle: "Chỉnh sửa nhóm quyền | Admin",
        role: role
    });
}


//[PATCH] /admin/roles/edit/:id
module.exports.editRole = async (req, res) => {
    const id = req.params.id;
    try {
        await Role.updateOne({_id: id}, req.body);
        req.flash("success", "Sửa nhóm quyền thành công");
        res.redirect(`${systemConfig.prefixAdmin}/roles/edit/${id}`);
    } catch (error) {
        req.flash("error", "Sửa nhóm quyền thất bại");
        res.redirect(`${systemConfig.prefixAdmin}/roles/edit/${id}`);
    }
}


//[DELETE] /admin/roles/delete/:id
module.exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
        await Role.updateOne({_id: id}, {deleted: true});
        req.flash("success", "Xóa nhóm quyền thành công");
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    } catch (error) {
        req.flash("error", "Xóa nhóm quyền thất bại");
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
}


//[GET] /admin/roles/permissions
module.exports.permission = async (req, res) => {
    const roles = await Role.find({deleted: false});
    res.render('admin/pages/roles/permissions', {
        pageTitle : "Phân quyền | Admin",
        roles: roles
    });
}