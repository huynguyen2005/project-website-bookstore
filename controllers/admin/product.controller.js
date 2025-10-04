const Product = require("../../models/product.model");
const systemConfig = require("../../config/system");

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
    
    const products = await Product.find(find).sort({position: "desc"}).limit(objectPagination.limitItems).skip(objectPagination.skip);

    const newProducts = products.map(item => {
        item.newPrice = item.price - (item.price * (item.discountPercent / 100));
        return item;
    });

    res.render('admin/pages/products/index.pug', {
        titlePage: "Danh sách sản phẩm | Admin",
        activeMenu: "products",
        activeSubMenu: "productList",
        products: newProducts,
        pagination: objectPagination,
        keyword: objectSearchProduct.keyword
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