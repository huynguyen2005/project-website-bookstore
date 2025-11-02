const BookCategory = require('../../models/book-category.model');
const createTreeHelper = require('../../helpers/createTree');

module.exports.category = async (req, res, next) => {
    const categories = await BookCategory.find({ deleted: false });
    const newCategories = createTreeHelper.createTree(categories);
    res.locals.layoutBookCategory = newCategories;
    next();
}