const dashboardRouter = require('./dashboard.route');
const bookRouter = require('./book.route');
const categoryRouter = require('./category.route');
const authorRouter = require('./author.route');
const coverTypeRouter = require('./cover-type.route');
const settingRouter = require('./setting.route');
const roleRouter = require('./role.route');
const accountRouter = require('./account.route');
const authRouter = require('./auth.route');
const myAccountRouter = require('./my-account.route');
const orderRouter = require('./order.route');
const blogRouter = require('./blog.route');
const userRouter = require('./user.route');
const systemConfig = require('../../config/system');
const authMiddleware = require('../../middlewares/admin/auth.middleware');

module.exports = (app) => {
    app.use(systemConfig.prefixAdmin + "/dashboard", 
        authMiddleware.requireAuth,
        dashboardRouter
    );
    app.use(systemConfig.prefixAdmin + "/books", 
        authMiddleware.requireAuth,
        bookRouter
    );
    app.use(systemConfig.prefixAdmin + "/categories", 
        authMiddleware.requireAuth,
        categoryRouter
    );
    app.use(systemConfig.prefixAdmin + "/authors", 
        authMiddleware.requireAuth,
        authorRouter
    );
    app.use(systemConfig.prefixAdmin + "/cover-types", 
        authMiddleware.requireAuth,
        coverTypeRouter
    );
    app.use(systemConfig.prefixAdmin + "/settings", 
        authMiddleware.requireAuth,
        settingRouter
    );
    app.use(systemConfig.prefixAdmin + "/roles", 
        authMiddleware.requireAuth,
        roleRouter
    );
    app.use(systemConfig.prefixAdmin + "/accounts", 
        authMiddleware.requireAuth,
        accountRouter
    );
    app.use(systemConfig.prefixAdmin + "/users", 
        authMiddleware.requireAuth,
        userRouter
    );
    app.use(systemConfig.prefixAdmin + "/my-account", 
        authMiddleware.requireAuth,
        myAccountRouter
    );
    app.use(systemConfig.prefixAdmin + "/orders", 
        authMiddleware.requireAuth,
        orderRouter
    );
    app.use(systemConfig.prefixAdmin + "/blogs", 
        authMiddleware.requireAuth,
        blogRouter
    );
    app.use(systemConfig.prefixAdmin + "/auth", authRouter);
}
