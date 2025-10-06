const Product = require("../../models/product.model");
const systemConfig = require("../../config/system");
const getCategoriesHelper = require("../../helper/getCategories");

//[GET] /admin/products/
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };

    //Pagination
    const objectPagination = {
        currentPage: 1,
        limitItems: 5
    };
    if(req.query.page){
        objectPagination.currentPage = parseInt(req.query.page);
    }
    const totalItem = await Product.countDocuments({deleted: false});
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;
    objectPagination.totalPage = Math.ceil(totalItem / objectPagination.limitItems);
    //End Pagination

    //Search product
    const objectSearchProduct = {
        keyword: ""
    }
    if(req.query.keyword){
        objectSearchProduct.keyword = req.query.keyword;
        const regex = new RegExp(objectSearchProduct.keyword, "i");
        objectSearchProduct.regex = regex;
        find.bookName = objectSearchProduct.regex;
    }
    //End search product
    

    //Lấy ra danh sách danh mục cấp 1 và cấp 2
    const listProduct = await Product.find({deleted: false});
    const getCategories = getCategoriesHelper(listProduct);
    //End lấy ra danh sách danh mục cấp 1 và cấp 2


    //Filter product
    const valueFilterStatus = req.query.status || "";
    const valueFilterCategoryLevel1 = req.query.categoryLevel1 || "";
    const valueFilterCategoryLevel2 = req.query.categoryLevel2 || "";
    if(valueFilterStatus)   find["status"] = valueFilterStatus;
    if(valueFilterCategoryLevel1) find["category.level1.categoryName"] = valueFilterCategoryLevel1;
    if(valueFilterCategoryLevel2) find["category.level2.genreName"] = valueFilterCategoryLevel2;
    //End filter product



    const products = await Product.find(find).sort({position: "desc"}).limit(objectPagination.limitItems).skip(objectPagination.skip);

    const newProducts = products.map(item => {
        item.newPrice = item.price - (item.price * (item.discountPercent / 100));
        return item;
    });

    res.render('admin/pages/products/index.pug', {
        pageTitle: "Danh sách sản phẩm | Admin",
        activeMenu: "products",
        activeSubMenu: "productList",
        products: newProducts,
        pagination: objectPagination,
        keyword: objectSearchProduct.keyword,
        categoryLevel1List: getCategories.categoryLevel1List,
        categoryLevel2List: getCategories.categoryLevel2List,
        valueFilterStatus: valueFilterStatus,
        valueFilterCategoryLevel1: valueFilterCategoryLevel1,
        valueFilterCategoryLevel2 : valueFilterCategoryLevel2
    });
}

//[PATCH] /admin/products/:id
module.exports.changeStatus = async (req, res) => {
    const id = req.params.id;
    const status = req.params.status;
    const page = req.query.page;
    await Product.updateOne({_id: id}, {status: status});
    res.redirect(`${systemConfig.prefixAdmin}/products/?page=${page}`);
}   

//[PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const ids = req.body.ids.split(", ");
    const type = req.body.type;
    switch (type) {
        case "active":
            await Product.updateMany({_id: {$in: ids}}, {status: type});
            break;
        case "inactive":
            await Product.updateMany({_id: {$in: ids}}, {status: type});
            break;
        case "delete-all":
            await Product.updateMany({_id: {$in: ids}}, {deleted: true, deletedAt: new Date()});
            break;
        default:
            break;
    }
    res.redirect(`${systemConfig.prefixAdmin}/products?page=${req.query.page}`);
}

//[GET] /admin/products/create
module.exports.create = async (req, res) => {
    const listProduct = await Product.find({deleted: false});
    const getCategories = getCategoriesHelper(listProduct);

    res.render('admin/pages/products/create', {
        pageTitle: "Thêm sản phẩm | Admin",
        activeMenu: "products",
        activeSubMenu: "createProduct",
        categoryLevel1List: getCategories.categoryLevel1List,
        categoryLevel2List: getCategories.categoryLevel2List,
    });
}


//[POST] /admin/products/create
module.exports.createProduct = async (req, res) => {
    const listProduct = await Product.find({deleted: false});
    const getCategories = getCategoriesHelper(listProduct);

    req.body.price ? req.body.price = parseInt(req.body.price) : req.body.price = 0;
    req.body.discountPercent ? req.body.discountPercent = parseInt(req.body.discountPercent) : req.body.discountPercent = 0;
    req.body.pageCount ? req.body.pageCount = parseInt(req.body.pageCount) : req.body.pageCount = 0;
    req.body.stockQuantity ? req.body.stockQuantity = parseInt(req.body.stockQuantity) : req.body.stockQuantity = 0;
    req.body.averageRating ? req.body.averageRating = parseFloat(req.body.averageRating) : req.body.averageRating = 0;
    req.body.reviewCount ? req.body.reviewCount = parseInt(req.body.reviewCount) : req.body.reviewCount = 0;
    req.body.images = [];
    if(req.body.position){
        req.body.position = parseInt(req.body.position);
    }else{
        const countProduct = await Product.countDocuments();
        req.body.position = countProduct + 1;
    }
    
    req.body.authorName = req.body.authorName.split(', ');

    console.log(req.file);
    // const product = new Product(req.body);
    // await product.save();

    res.render('admin/pages/products/create', {
        pageTitle: "Thêm sản phẩm | Admin",
        activeMenu: "products",
        activeSubMenu: "createProduct",
        categoryLevel1List: getCategories.categoryLevel1List,
        categoryLevel2List: getCategories.categoryLevel2List,
    });

    res.redirect(`${systemConfig.prefixAdmin}/products`);
}


//[DELETE] /admin/products/delete/:id
module.exports.deleteProduct = async (req, res) => {
    const id = req.params.id;
    const page = req.query.page;
    await Product.updateOne({_id: id}, {
        deleted: true,
        deletedAt: new Date()
    });
    res.redirect(`${systemConfig.prefixAdmin}/products?page=${page}`);
}


//[GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    const listProduct = await Product.find({deleted: false});
    const getCategories = getCategoriesHelper(listProduct);
    const id = req.params.id;
    const product = await Product.findOne({_id: id});
    res.render('admin/pages/products/edit', {
        pageTitle: "Chỉnh sửa sản phẩm | Admin",
        product: product,
        activeMenu: "products",
        activeSubMenu: "productList",
        categoryLevel1List: getCategories.categoryLevel1List,
        categoryLevel2List: getCategories.categoryLevel2List,
    });
}


//[GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    const product = await Product.findOne({_id: id});
    res.render('admin/pages/products/detail', {
        pageTitle: "Chi tiết sản phẩm | Admin",
        product: product
    })
}