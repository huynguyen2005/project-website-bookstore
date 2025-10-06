module.exports = (listProduct) => {
    const categoryLevel1List = [...new Set(listProduct.map(item => item.category.level1.categoryName))];
    const categoryLevel2List = [];
    listProduct.forEach(item => {
        const categoryName = item.category.level1.categoryName;
        const genreName = item.category.level2.genreName;
        if(!categoryLevel2List.find(value => value.categoryName === categoryName && value.genreName === genreName)){
            categoryLevel2List.push({categoryName: categoryName, genreName: genreName});
        }
    });
    return {
        categoryLevel1List: categoryLevel1List,
        categoryLevel2List: categoryLevel2List
    };
}
