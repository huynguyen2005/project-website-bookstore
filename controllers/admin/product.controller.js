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
    

    //Lấy ra danh sách danh mục cấp 1 và cấp 2
    const listProduct = await Product.find(find)
    const categoryLevel1List = [...new Set(listProduct.map(item => item.category.level1.categoryName))];
    const categoryLevel2List = [];
    listProduct.forEach(item => {
        const categoryName = item.category.level1.categoryName;
        const genreName = item.category.level2.genreName;
        if(!categoryLevel2List.find(value => value.categoryName === categoryName && value.genreName === genreName)){
            categoryLevel2List.push({categoryName: categoryName, genreName: genreName});
        }
    });
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
        titlePage: "Danh sách sản phẩm | Admin",
        activeMenu: "products",
        activeSubMenu: "productList",
        products: newProducts,
        pagination: objectPagination,
        keyword: objectSearchProduct.keyword,
        categoryLevel1List: categoryLevel1List,
        categoryLevel2List: categoryLevel2List,
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
