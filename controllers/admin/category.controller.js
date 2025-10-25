const BookCategory = require("../../models/book-category.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helper/createTree");
const searchInforHelper = require("../../helper/searchInfor");

//[GET] /admin/books/
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };

    //Filter infor
    if(req.query.status){
        find.status = req.query.status;
    }
    if(req.query.createBy){
        find.createBy = req.query.createBy;
    }
    //End Filter infor

    //Search category
    const objectSearch = searchInforHelper(req.query.keyword);
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    } 
    

    let bookCategories = await BookCategory.find(find).sort({ position: "desc" });

    const check = req.query.status || req.query.createBy || req.query.keyword;
    if(!check){
        bookCategories = createTreeHelper.createTree(bookCategories);
    }

    res.render('admin/pages/categories/index.pug', {
        pageTitle: "Danh mục sách | Admin",
        categories: bookCategories,
        activeMenu: "books",
        activeSubMenu: "categorieList",
        keyword: req.query.keyword
    })
}

//[PATCH] /admin/categories/:id/:status
module.exports.changeStatus = async (req, res) => {
    const id = req.params.id;
    const status = req.params.status;
    await BookCategory.updateOne({ _id: id }, { status: status });
    req.flash('success', 'Cập nhật trạng thái danh mục thành công');
    res.redirect(`${systemConfig.prefixAdmin}/categories`);
};


//[PATCH] /admin/categories/change-multi
module.exports.changeMulti = async (req, res) => {
    const ids = req.body.ids.split(", ");
    const type = req.body.type;
    switch (type) {
        case "active":
            await BookCategory.updateMany({ _id: { $in: ids } }, { status: type });
            req.flash('success', 'Cập nhật trạng thái danh mục thành công');
            break;
        case "inactive":
            await BookCategory.updateMany({ _id: { $in: ids } }, { status: type });
            req.flash('success', 'Cập nhật trạng thái danh mục thành công');
            break;
        case "delete-all":
            await BookCategory.updateMany({ _id: { $in: ids } }, { deleted: true, deletedAt: new Date() });
            req.flash('success', 'Xóa danh mục thành công');
            break;
        default:
            break;
    }
    res.redirect(`${systemConfig.prefixAdmin}/categories`);
};


//[GET] /admin/categories/create
module.exports.create = async (req, res) => {
    const bookCategories = await BookCategory.find({deleted: false});
    const newBookCategories =  createTreeHelper.createTree(bookCategories);

    res.render("admin/pages/categories/create", {
        pageTitle: "Thêm danh mục sách | Admin",
        activeMenu: "books",
        activeSubMenu: "categorieList",
        bookCategories: newBookCategories,
    });
};

// [POST] /admin/categories/create
module.exports.createCategory = async (req, res) => {
    if (req.body.position) {
        req.body.position = parseInt(req.body.position);
    } else {
        const cnt = await BookCategory.countDocuments();
        req.body.position = cnt + 1;
    }

    try {
        const bookCategory = new BookCategory(req.body);
        await bookCategory.save();
        req.flash('success', 'Thêm danh mục thành công');
        res.redirect(`${systemConfig.prefixAdmin}/categories`);
    } catch (error) {
        req.flash('error', 'Thêm danh mục thất bại');
        res.redirect(`${systemConfig.prefixAdmin}/categories`);
    }
};

// [DELETE] /admin/categories/delete/:id
module.exports.deleteCategory = async (req, res) => {
    const id = req.params.id;
    await BookCategory.updateOne({ _id: id }, {
        deleted: true,
        deletedAt: new Date()
    });
    req.flash('success', 'Xóa danh mục thành công');
    res.redirect(`${systemConfig.prefixAdmin}/categories`);
};

//[GET] /admin/categories/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;
    const bookCategory = await BookCategory.findOne({ _id: id });

    //Lấy danh mục sách
    const bookCategories = await BookCategory.find({deleted: false});
    const newBookCategories =  createTreeHelper.createTree(bookCategories);
 
    res.render("admin/pages/categories/edit", {
        pageTitle: "Chỉnh sửa sách | Admin",
        category: bookCategory,
        activeMenu: "books",
        activeSubMenu: "categorieList",
        bookCategories: newBookCategories,
    });
};

// [PATCH] /admin/categories/edit/:id
module.exports.editCategory = async (req, res) => {
    const id = req.params.id;

    if (req.body.position) {
        req.body.position = parseInt(req.body.position);
    } else {
        const cnt = await BookCategory.countDocuments();
        req.body.position = cnt + 1;
    }

    try {
        await BookCategory.updateOne({ _id: id }, req.body);
        req.flash('success', 'Sửa danh mục thành công');
        res.redirect(`${systemConfig.prefixAdmin}/categories/edit/${id}`);
    } catch (error) {
        req.flash('error', 'Sửa danh mục thất bại');
        res.redirect(`${systemConfig.prefixAdmin}/categories`);
    }
};


// [GET] /admin/categories/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    const bookCategory = await BookCategory.findOne({ _id: id });
    let parentCategory = "";
    if(bookCategory.parent_id){
        parentCategory = await BookCategory.findOne({_id: bookCategory.parent_id});
    }
    res.render("admin/pages/categories/detail", {
        pageTitle: "Chi tiết danh mục | Admin",
        category: bookCategory,
        parentCategory: parentCategory ? parentCategory.title : ""
    });
};
