const bookRoutes = require('./book.route');
const homeRoutes = require('./home.route');
const searchRoutes = require('./search.route');
const collectionsRoutes = require('./collections.route');
const booksCategoryMiddleware = require("../../middlewares/client/book-category.middleware");
// const cartMiddleware = require("../../middlewares/client/cart.middleware");
module.exports = (app) => {
    app.use(booksCategoryMiddleware.category);
    // app.use(cartMiddleware.cartId);
    
    app.use('/', homeRoutes);
    app.use('/collections', collectionsRoutes);
    app.use('/books', bookRoutes);
    app.use('/search', searchRoutes);
} 