const bookRoutes = require('./book.route');
const homeRoutes = require('./home.route');
const searchRoutes = require('./search.route');
const collectionsRoutes = require('./collections.route');
const cartRoutes = require('./cart.route');
const checkoutRoutes = require('./checkout.route');
const userRoutes = require('./user.route');
const booksCategoryMiddleware = require("../../middlewares/client/book-category.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const userMiddleware = require("../../middlewares/client/user.middleware");
module.exports = (app) => {
    app.use(booksCategoryMiddleware.category);
    app.use(userMiddleware.inforUser);
    app.use(['/','/collections','/books','/search','/cart','/checkout', '/user'], cartMiddleware.cartId);
    app.use('/', homeRoutes);
    app.use('/collections', collectionsRoutes);
    app.use('/books', bookRoutes);
    app.use('/search', searchRoutes);
    app.use('/cart', cartRoutes);
    app.use('/checkout', checkoutRoutes);
    app.use('/user', userRoutes);
} 