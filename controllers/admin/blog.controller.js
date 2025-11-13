const Blog = require('../../models/blog.model');
const Account = require('../../models/account.model');
const systemConfig = require('../../config/system');

// [GET] /admin/blogs
module.exports.index = async (req, res) => {
    const find = { deleted: false };

    // Search
    if (req.query.keyword) {
        find.title = { $regex: req.query.keyword, $options: 'i' };
    }

    if (req.query.status) find.status = req.query.status;

    const blogs = await Blog.find(find).sort({ createdAt: -1 });

    for (const blog of blogs) {
        const account = await Account.findById(blog.createdBy.account_id).select('-password');
        if (account) blog.accountFullName = account.fullName;
    }

    res.render("admin/pages/blogs/index", {
        pageTitle: "Danh sách bài viết | Admin",
        activeMenu: "blogs",
        records: blogs,
        keyword: req.query.keyword || ''
    });
};

// [PATCH] /admin/blogs/change-status/:id/:status
module.exports.changeStatus = async (req, res) => {
    const { id, status } = req.params;
    const updatedBy = { account_id: res.locals.user._id, updatedAt: Date.now() };

    await Blog.updateOne({ _id: id }, { status: status, $push: { updatedBy } });
    req.flash('success', 'Cập nhật trạng thái bài viết thành công');
    res.redirect(`${systemConfig.prefixAdmin}/blogs`);
};

// [PATCH] /admin/blogs/change-multi
module.exports.changeMulti = async (req, res) => {
    const ids = req.body.ids.split(", ");
    const type = req.body.type;
    const updatedBy = { account_id: res.locals.user._id, updatedAt: Date.now() };

    switch (type) {
        case "active":
        case "inactive":
            await Blog.updateMany({ _id: { $in: ids } }, { status: type, $push: { updatedBy } });
            req.flash('success', 'Cập nhật trạng thái bài viết thành công');
            break;
        case "delete-all":
            const deletedBy = { account_id: res.locals.user._id, deletedAt: Date.now() };
            await Blog.updateMany({ _id: { $in: ids } }, { deleted: true, deletedBy });
            req.flash('success', 'Xóa bài viết thành công');
            break;
    }
    res.redirect(`${systemConfig.prefixAdmin}/blogs`);
};

// [GET] /admin/blogs/create
module.exports.create = (req, res) => {
    res.render("admin/pages/blogs/create", {
        pageTitle: "Thêm bài viết | Admin",
        activeMenu: "blogs",
    });
};

// [POST] /admin/blogs/create
module.exports.createBlog = async (req, res) => {
    req.body.createdBy = { account_id: res.locals.user._id };
    try {
        const blog = new Blog(req.body);
        await blog.save();
        req.flash("success", "Thêm bài viết thành công");
    } catch (error) {
        req.flash("error", "Thêm bài viết thất bại");
    }
    res.redirect(`${systemConfig.prefixAdmin}/blogs`);
};

// [GET] /admin/blogs/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    const record = await Blog.findOne({ _id: id, deleted: false });
    if (!record) {
        req.flash("error", "Không tìm thấy bài viết");
        return res.redirect(`${systemConfig.prefixAdmin}/blogs`);
    }

    const account = await Account.findById(record.createdBy.account_id).select('-password');
    if (account) record.accountFullName = account.fullName;

    const updatedBy = record.updatedBy.slice(-1)[0];
    if (updatedBy) {
        const accountUpdated = await Account.findById(updatedBy.account_id).select('-password');
        updatedBy.fullName = accountUpdated ? accountUpdated.fullName : "";
    }

    res.render("admin/pages/blogs/detail", {
        pageTitle: "Chi tiết bài viết | Admin",
        activeMenu: "blogs",
        record
    });
};

// [GET] /admin/blogs/edit/:id
module.exports.edit = async (req, res) => {
    const record = await Blog.findOne({ _id: req.params.id, deleted: false });
    if (!record) {
        req.flash("error", "Không tìm thấy bài viết");
        return res.redirect(`${systemConfig.prefixAdmin}/blogs`);
    }

    res.render("admin/pages/blogs/edit", {
        pageTitle: "Chỉnh sửa bài viết | Admin",
        activeMenu: "blogs",
        record
    });
};

// [PATCH] /admin/blogs/edit/:id
module.exports.editBlog = async (req, res) => {
    const id = req.params.id;
    const updatedBy = { account_id: res.locals.user._id, updatedAt: Date.now() };

    try {
        await Blog.updateOne({ _id: id }, { ...req.body, $push: { updatedBy } });
        req.flash("success", "Cập nhật bài viết thành công");
        res.redirect(`${systemConfig.prefixAdmin}/blogs`);
    } catch (error) {
        req.flash("error", "Cập nhật bài viết thất bại");
        res.redirect(`${systemConfig.prefixAdmin}/blogs/edit/${id}`);
    }
};

// [DELETE] /admin/blogs/delete/:id
module.exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        await Blog.updateOne({ _id: id }, {
            deleted: true,
            deletedBy: { account_id: res.locals.user._id, deletedAt: Date.now() }
        });
        req.flash("success", "Xóa bài viết thành công");
    } catch (error) {
        req.flash("error", "Xóa bài viết thất bại");
    }
    res.redirect(`${systemConfig.prefixAdmin}/blogs`);
};
