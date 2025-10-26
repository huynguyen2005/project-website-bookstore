let cnt = 0;
function createTree(categories, parentId = "") {
    const tree = [];
    categories.forEach(item => {
        if (item.parent_id == parentId) {
            cnt++;
            const newItem = item;
            newItem.index = cnt;
            const children = createTree(categories, item.id);
            if (children.length) {
                newItem.children = children;
            }
            tree.push(newItem);
        }
    });
    return tree;
}
module.exports.createTree = (categories) => {
    cnt = 0;
    const newCategories = createTree(categories);
    return newCategories;
}