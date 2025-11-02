const BookCategory = require('../models/book-category.model');

module.exports.category = async (parentId) => {
    const getSubCategory = async (parentId) => {
        const subs = await BookCategory.find({ parent_id: parentId, status: "active", deleted: false });
        let allSub = [...subs];
        for (const sub of subs) {
            const childs = await getSubCategory(sub._id);
            allSub = allSub.concat(childs);
        }
        return allSub;
    }
    const arrCategory = await getSubCategory(parentId);
    return arrCategory;
}